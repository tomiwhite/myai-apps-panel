import os
import shutil
import sys
from glob import glob

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# Mapowanie plików do nowych folderów
MOVE_MAP = [
    ('app_1.js', 'tools/app_1.js'),
    ('chart_script.py', 'presentations/chart_script.py'),
    ('chart_script_1.py', 'presentations/chart_script_1.py'),
    ('przewodnik-organizacji-aplikacji.md', 'docs/przewodnik-organizacji-aplikacji.md'),
    ('chart.png', 'docs/chart.png'),
    ('flowchart.png', 'docs/flowchart.png'),
]


def move_file(src, dst):
    src_path = os.path.join(ROOT, src)
    dst_path = os.path.join(ROOT, dst)
    dst_dir = os.path.dirname(dst_path)
    if not os.path.exists(src_path):
        print(f"Plik nie istnieje: {src_path}")
        return
    os.makedirs(dst_dir, exist_ok=True)
    shutil.move(src_path, dst_path)
    print(f"Przeniesiono: {src_path} -> {dst_path}")


def main():
    for src, dst in MOVE_MAP:
        move_file(src, dst)
    print("Reorganizacja zakończona!")

if __name__ == "__main__":
    main()
