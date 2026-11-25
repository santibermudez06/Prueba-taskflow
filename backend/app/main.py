from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from pwdlib import PasswordHash

from app.database import get_db

app = FastAPI(title="TaskFlow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración para verificar contraseñas con Argon2
password_hash = PasswordHash.recommended()


@app.get("/")
def inicio():
    return {"mensaje": "TaskFlow API funcionando"}


@app.post("/api/login")
def login(datos: dict, db: Session = Depends(get_db)):

    email = datos.get("email", "").strip().lower()
    password = datos.get("password", "")

    if not email or not password:
        raise HTTPException(
            status_code=400,
            detail="Correo y contraseña son obligatorios"
        )

    # VULNERABLE: el correo se concatena directamente en la consulta SQL
    consulta = text(f"""
        SELECT id, name, email, password_hash
        FROM users
        WHERE LOWER(email) = '{email}'
    """)

    usuario = db.execute(consulta).mappings().first()

    if not usuario:
        raise HTTPException(
            status_code=401,
            detail="Credenciales incorrectas"
        )

    if not password_hash.verify(password, usuario["password_hash"]):
        raise HTTPException(
            status_code=401,
            detail="Credenciales incorrectas"
        )

    return {
        "mensaje": "Inicio de sesión exitoso",
        "usuario": {
            "id": usuario["id"],
            "name": usuario["name"],
            "email": usuario["email"]
        }
    }