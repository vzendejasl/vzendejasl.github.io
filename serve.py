#!/usr/bin/env python3
"""Local preview server for this site.

    python3 serve.py          # then open http://localhost:8000
    python3 serve.py 8080     # use another port

Unlike `python3 -m http.server`, this one answers HTTP Range requests.
Browsers need those to seek inside a video (the scrubber under the 3D movies),
and Safari will not play video at all without them.
GitHub Pages already supports Range requests, so you do not need this file there.
"""
import os
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class Handler(SimpleHTTPRequestHandler):
    range_left = None

    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def send_head(self):
        self.range_left = None
        header = self.headers.get("Range")
        path = self.translate_path(self.path)
        match = re.fullmatch(r"bytes=(\d*)-(\d*)", (header or "").strip())
        if not match or not os.path.isfile(path):
            return super().send_head()
        size = os.path.getsize(path)
        first, last = match.groups()
        if first == "":                      # "bytes=-N": the last N bytes
            if last == "":
                return super().send_head()
            start, end = max(0, size - int(last)), size - 1
        else:
            start = int(first)
            end = min(int(last), size - 1) if last else size - 1
        if start >= size or start > end:
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return None
        f = open(path, "rb")
        f.seek(start)
        self.range_left = end - start + 1
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(self.range_left))
        self.end_headers()
        return f

    def copyfile(self, source, outputfile):
        try:
            if self.range_left is None:
                super().copyfile(source, outputfile)
                return
            left = self.range_left
            while left > 0:
                chunk = source.read(min(65536, left))
                if not chunk:
                    break
                outputfile.write(chunk)
                left -= len(chunk)
        except (BrokenPipeError, ConnectionResetError):
            pass                              # the browser stopped reading, which is normal for video


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with ThreadingHTTPServer(("127.0.0.1", port), Handler) as server:
        print(f"Serving on http://localhost:{port}  (Ctrl+C to stop)")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print()
