export const generateMailSignup = (completeName: string) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");
      * {
        margin: 0;
        font-family: "Roboto", sans-serif;
        font-weight: 400;
        font-style: normal;
      }
    </style>
  </head>
  <body>
    <main>
      <div style="justify-content: flex-start">
        <img
          style="width: 200px; height: auto"
          src="https://res.cloudinary.com/dvquomppa/image/upload/v1717654334/credito_ya/cirm9vbdngqyxymcpfad.png"
        />
      </div>
      <p style="margin-top: 1em;">
        ${completeName}, ¡Bienvenido a Credito Ya! Gracias por registrarte.
        Estamos emocionados de tenerte con nosotros.
      </p>
      <p style="margin-top: 1em;">
        Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
      </p>

      <h5 style="margin-top: 2em; color: #6c6c6c">Saludos,</h5>
      <h4>Equipo de Credito Ya</h4>
    </main>
  </body>
</html>

`;
};
