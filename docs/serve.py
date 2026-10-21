# -*- coding: utf-8 -*-
"""本地静态服务：托管 docs/ 并自动打开浏览器。

用法：
    python serve.py
或双击「启动网站.bat」。
"""
import http.server
import os
import socketserver
import webbrowser

PORT = 8000


def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print("工作百科本地服务已启动： http://localhost:%d" % PORT)
        try:
            webbrowser.open("http://localhost:%d" % PORT)
        except Exception:
            pass
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n已停止。")


if __name__ == "__main__":
    main()
