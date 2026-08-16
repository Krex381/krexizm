import asyncio
import http.server
import socketserver
import threading
import time
import os
from playwright.async_api import async_playwright

# Serve dist folder in background
DIST_DIR = r"C:\Users\Onmaz Eren\Desktop\krexizm\dist"
PORT = 8765

def serve():
    os.chdir(DIST_DIR)
    with socketserver.TCPServer(('', PORT), http.server.SimpleHTTPRequestHandler) as httpd:
        httpd.serve_forever()

server_thread = threading.Thread(target=serve, daemon=True)
server_thread.start()
time.sleep(1)

async def capture():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={'width': 1200, 'height': 630})
        
        # Navigate to the local server
        await page.goto(f'http://localhost:{PORT}', wait_until='networkidle')
        
        # Wait for animations to settle
        await page.wait_for_timeout(2000)
        
        # Hide the fixed footer and topbar for cleaner screenshot if desired
        await page.add_style_tag(content="""
            .topbar, footer { display: none !important; }
            .page-content { padding-top: 0 !important; padding-bottom: 0 !important; }
            .glass { box-shadow: none !important; }
        """)
        
        await page.wait_for_timeout(500)
        
        # Capture screenshot
        await page.screenshot(path=os.path.join(DIST_DIR, 'og-image.png'), full_page=False)
        print("Screenshot saved to dist/og-image.png")
        
        await browser.close()

asyncio.run(capture())