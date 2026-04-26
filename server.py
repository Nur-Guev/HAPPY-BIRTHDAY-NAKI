# =====================================================
#  NAKAMA 18 AÑOS — server.py
#  Servidor Flask para levantar el proyecto localmente.
#  
#  Instalación:
#    pip install flask
#
#  Ejecución:
#    python server.py
#
#  Luego abrí tu navegador en:
#    http://localhost:5000
# =====================================================

from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='.')

# ─── Ruta principal: sirve index.html ───────────────
@app.route('/')
def index():
    """Sirve la página principal de cumpleaños."""
    return send_from_directory('.', 'index.html')

# ─── Ruta para archivos estáticos (CSS, JS, audio, imágenes) ───
@app.route('/<path:filename>')
def static_files(filename):
    """
    Sirve cualquier archivo estático:
    - style.css
    - app.js
    - youth-KIHYUN.mp3
    - assets/minhyuk.jpg, assets/jay.jpg, etc.
    """
    return send_from_directory('.', filename)

# ─── Punto de entrada ───────────────────────────────
if __name__ == '__main__':
    print("=" * 50)
    print("  🎂 Servidor de Nakama 18 años iniciado")
    print("  Abrí tu navegador en: http://localhost:5000")
    print("=" * 50)
    app.run(debug=True, port=5000)