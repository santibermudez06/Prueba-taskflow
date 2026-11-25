
import { useState } from "react";
import { LockKeyhole, Mail, Layers, ArrowRight } from "lucide-react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setMessage("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        {
          email,
          password
        }
      );

      setSuccess(true);
      setMessage(`¡Bienvenido, ${response.data.usuario.name}!`);

    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.detail || "No se pudo iniciar sesión");
      } else {
        setMessage("No se pudo conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">

        <div className="brand">
          <div className="brand-icon">
            <Layers size={26} />
          </div>
          <h1>TaskFlow</h1>
        </div>

        <div className="login-heading">
          <span>BIENVENIDO</span>
          <h2>Iniciar sesión</h2>
          <p>Ingresa tus credenciales para continuar.</p>
        </div>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Correo electrónico</label>

          <div className="input-container">
            <Mail size={19} />
            <input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <label htmlFor="password">Contraseña</label>

          <div className="input-container">
            <LockKeyhole size={19} />
            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
            <ArrowRight size={18} />
          </button>

          {message && (
            <p
              className="login-message"
              role="status"
              style={{
                color: success ? "green" : "#dc2626"
              }}
            >
              {message}
            </p>
          )}
        </form>

        <footer>
          TaskFlow · Demostración de seguridad con Semgrep
        </footer>

      </section>
    </main>
  );
}

export default App;
