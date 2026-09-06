"""
Run all simulators and config server in a single terminal window
This script runs all processes in the background and shows combined output
"""
import subprocess
import sys
import os
import time
import signal
from threading import Thread
from queue import Queue

def log(message, level="INFO"):
    """Logging function with timestamp"""
    from datetime import datetime
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] [{level}] {message}")

processes = []

def run_process(command, name, output_queue):
    """Run a process and capture its output"""
    try:
        log(f"Starting {name}...")
        process = subprocess.Popen(
            command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1
        )
        processes.append((name, process))
        
        # Read output line by line
        for line in iter(process.stdout.readline, ''):
            if line:
                output_queue.put(f"[{name}] {line.rstrip()}")
        
        process.stdout.close()
        process.wait()
    except Exception as e:
        output_queue.put(f"[{name}] ERROR: {e}")

def print_output(output_queue):
    """Print output from queue"""
    while True:
        try:
            line = output_queue.get(timeout=0.1)
            print(line)
        except:
            continue

def signal_handler(sig, frame):
    """Handle Ctrl+C"""
    log("Stopping all processes...", "WARNING")
    for name, process in processes:
        try:
            process.terminate()
            # Wait a bit for graceful shutdown
            try:
                process.wait(timeout=2)
            except subprocess.TimeoutExpired:
                # Force kill if it doesn't stop
                process.kill()
            log(f"Stopped {name}")
        except Exception as e:
            log(f"Error stopping {name}: {e}", "ERROR")
    log("All processes stopped.", "INFO")
    sys.exit(0)

def main():
    """Main function"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    log("="*60)
    log("Starting All Simulators and Config Server")
    log("="*60)
    log("")
    
    output_queue = Queue()
    
    # Start output printer thread
    printer_thread = Thread(target=print_output, args=(output_queue,), daemon=True)
    printer_thread.start()
    
    # Start config server
    config_thread = Thread(
        target=run_process,
        args=("python serve_config.py", "CONFIG", output_queue),
        daemon=True
    )
    config_thread.start()
    
    time.sleep(2)
    
    # Start device 3 simulator
    device3_thread = Thread(
        target=run_process,
        args=("python device3_simulator.py", "DEVICE3", output_queue),
        daemon=True
    )
    device3_thread.start()
    
    time.sleep(1)
    
    # Start device 4 simulator
    device4_thread = Thread(
        target=run_process,
        args=("python device4_simulator.py", "DEVICE4", output_queue),
        daemon=True
    )
    device4_thread.start()
    
    # Register signal handler for Ctrl+C
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    log("")
    log("="*60)
    log("All processes started!")
    log("="*60)
    log("Press Ctrl+C to stop all processes")
    log("="*60)
    log("")
    
    try:
        # Keep main thread alive
        while True:
            time.sleep(1)
            # Check if any process has died
            for name, process in processes:
                if process.poll() is not None:
                    log(f"{name} process ended with code {process.returncode}", "WARNING")
    except KeyboardInterrupt:
        signal_handler(None, None)

if __name__ == "__main__":
    main()

