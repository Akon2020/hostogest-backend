export const resetPasswordEmailTemplate = (nom, email, url, resetToken) =>
  `
<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style=" max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #333333">Salut ${nom} 👋!</h2>
    <p style="color: #555555">Nous avons reçu une demande de réinitialisation de votre mot de passe lié au compte -> <strong>${email}</strong></p>
    <p style="color: #555555">Cliquez sur ce bouton ci-dessous pour créer un nouveau mot de passe et récupérer l'accès à votre compte</p>
    <p style="padding: 1.5rem 0"><a href="${url}/auth/resetpassword?token=${resetToken}" style="background-color: #e74c3c; color: #ffffff; padding: 15px; text-decoration: none; border-radius: 5px;">Réinitialiser votre mot de passe 🔐</a ></p>
    <p style="color: #555555">Le bouton ne fonctionne pas?<br />Utiliser ce lien <a href="${url}/auth/resetpassword?token=${resetToken}" style="color: #e74c3c; text-decoration: none">${url}/auth/resetpassword?token=${resetToken}</a ></p>
    <p style="color: #555555">A très vite 😇,</p>
    <p style="color: #555555">L'équipe de <a href="${url}" style="color: #e74c3c; text-decoration: none">HostoGest</a ></p>
    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0" />
    <p style="color: #999999">Si vous n'avez pas demandé à réinitialiser votre mot de passe, tenez nous informer <a href="mailto:akonkwaushindi@gmail.com" style="color: #e74c3c; text-decoration: none">en cliquant ici</a ></p>
  </div>
</div>
`;

export const roleAssignmentEmailTemplate = (nom, roleName, url) => `
<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #333333">Bonjour ${nom} 👋!</h2>
    <p style="color: #555555">Nous avons le plaisir de vous informer que vous avez été assigné au rôle suivant dans notre système : <strong>${roleName}</strong>.</p>
    <p style="color: #555555">Ce rôle vous permet d'accéder à de nouvelles fonctionnalités et permissions. Pour en savoir plus sur ce rôle, veuillez consulter votre tableau de bord à l'adresse suivante :</p>
    <p style="padding: 1.5rem 0"><a href="${url}" style="background-color: #e74c3c; color: #ffffff; padding: 15px; text-decoration: none; border-radius: 5px;">Accédez à votre tableau de bord</a></p>
    <p style="color: #555555">Si vous avez des questions ou si vous avez besoin d'assistance, n'hésitez pas à nous contacter.</p>
    <p style="color: #555555">A très bientôt,</p>
    <p style="color: #555555">L'équipe de <a href="${url}" style="color: #e74c3c; text-decoration: none">HostoGest</a></p>
    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0" />
    <p style="color: #999999">Si vous n'attendiez pas l'attribution de ce rôle, merci de nous informer <a href="mailto:akonkwaushindi@gmail.com" style="color: #e74c3c; text-decoration: none">en cliquant ici</a>.</p>
  </div>
</div>
`;
