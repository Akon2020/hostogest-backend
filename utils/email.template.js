const currentYear = new Date().getFullYear();

export const welcomeEmailTemplate = (nom, email, url) => {
  return `
<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style=" max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #333333">Bienvenue ${nom} 👋!</h2>
    <p style="color: #555555">Votre compte a été créé avec succès pour l'adresse email</p> <strong style="text-align: center">${email}</strong>
    <p style="color: #555555">Vous disposez maintenant d'un compte sur notre plateforme, cependant vous n'avez pas encore accès au système de gestion.</p>
    <p style="color: #555555">Pour obtenir les accès nécessaires, veuillez contacter l'administrateur du système qui vous attribuera les permissions appropriées.</p>
    <p style="color: #555555">Vous pouvez contacter l'administrateur à l'adresse suivante</p>
<a href="mailto:admin@hostogest.com" style="background-color: #e74c3c; color: #fff; padding: 10px; border-radius: 5px; text-decoration: none">admin@hostogest.com</a>
    <p style="color: #555555">A très bientôt 😇,</p>
    <p style="color: #555555">L'équipe de <a href="${url}" style="color: #e74c3c; text-decoration: none">HostoGest</a></p>
    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0" />
    <p style="color: #999999">Ce message a été envoyé automatiquement suite à la création de votre compte. Merci de ne pas y répondre.</p>
    <p style="color: #999999; text-align: center;">&copy; ${currentYear} HostoGest – Tous droits réservés</p>
    </div>
</div>
`;
};

export const newUserEmailTemplate = (nom, email, defaultPassword, url) => {
  return `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style=" max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #333333">Bienvenue ${nom} 👋!</h2>
    <p style="color: #555555">Votre compte a été créé avec succès pour l'adresse email : <strong style="text-align: center">${email}</strong></p>
    <p style="color: #555555">Voici votre mot de passe par défaut pour votre première connexion :</p>
    <div style="background-color: #f2f2f2; padding: 10px; border-radius: 5px; margin: 10px 0; text-align: center;">
      <strong style="font-size: 1.2em; color: #e74c3c;">${defaultPassword}</strong>
    </div>
    <p style="color: #555555"><strong>Important :</strong> Pour des raisons de sécurité, veuillez vous connecter au système en utilisant ce mot de passe par défaut et le modifier immédiatement avant d'accéder aux autres fonctionnalités.</p>
    <p style="color: #555555">Cliquez sur le lien ci-dessous pour accéder à la page de connexion :</p>
    <p style="text-align: center;">
      <a href="${url}" style="background-color: #e74c3c; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">Se connecter au système</a>
    </p>
    <p style="color: #555555">Après votre connexion et le changement de mot de passe, vous pourrez profiter pleinement de toutes les fonctionnalités de notre système.</p>
    <p style="color: #555555">A très bientôt 😇,</p>
    <p style="color: #555555">L'équipe de <a href="${url}" style="color: #e74c3c; text-decoration: none">HostoGest</a></p>
    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0" />
    <p style="color: #999999">Ce message a été envoyé automatiquement suite à la création de votre compte. Merci de ne pas y répondre.</p>
    <p style="color: #999999; text-align: center;">&copy; ${currentYear} HostoGest – Tous droits réservés</p>
    </div>
</div>`;
};

export const resetPasswordEmailTemplate = (nom, email, url, resetToken) => {
  return `
<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style=" max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #333333">Salut ${nom} 👋!</h2>
    <p style="color: #555555">Nous avons reçu une demande de réinitialisation de votre mot de passe lié au compte <strong>${email}</strong></p>
    <p style="color: #555555">Cliquez sur ce bouton ci-dessous pour créer un nouveau mot de passe et récupérer l'accès à votre compte</p>
    <p style="padding: 1.5rem 0"><a href="${url}/auth/resetpassword?token=${resetToken}" style="background-color: #e74c3c; color: #ffffff; padding: 15px; text-decoration: none; border-radius: 5px;">Réinitialiser votre mot de passe 🔐</a ></p>
    <p style="color: #555555">Le bouton ne fonctionne pas?<br />Utiliser ce lien <a href="${url}/auth/resetpassword?token=${resetToken}" style="color: #e74c3c; text-decoration: none">${url}/auth/resetpassword?token=${resetToken}</a ></p>
    <p style="color: #555555">A très vite 😇,</p>
    <p style="color: #555555">L'équipe de <a href="${url}" style="color: #e74c3c; text-decoration: none">HostoGest</a ></p>
    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0" />
    <p style="color: #999999">Si vous n'avez pas demandé à réinitialiser votre mot de passe, tenez nous informer <a href="mailto:akonkwaushindi@gmail.com" style="color: #e74c3c; text-decoration: none">en cliquant ici</a ></p>
    <p style="color: #999999 text-align: center;">&copy; ${currentYear} HostoGest – Tous droits réservés</p>
  </div>
</div>
`;
};

export const roleAssignmentEmailTemplate = (
  nom,
  roleName,
  url,
  features = []
) => {
  let featuresTableHtml = "";
  if (features.length > 0) {
    featuresTableHtml = `
      <h3 style="color: #333333;">Fonctionnalités associées à votre nouveau rôle :</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #dddddd; padding: 8px; text-align: left;">Nom de la fonctionnalité</th>
            <th style="border: 1px solid #dddddd; padding: 8px; text-align: left;">Description</th>
          </tr>
        </thead>
        <tbody>
          ${features
            .map(
              (feature) => `
            <tr>
              <td style="border: 1px solid #dddddd; padding: 8px;">${
                feature.name
              }</td>
              <td style="border: 1px solid #dddddd; padding: 8px;">${
                feature.description || "Pas de description"
              }</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <p style="color: #555555; margin-top: 15px;">Vous pouvez désormais utiliser ces fonctionnalités via votre tableau de bord.</p>
    `;
  } else {
    featuresTableHtml = `
      <p style="color: #555555;">Ce rôle ne semble pas avoir de fonctionnalités spécifiques associées pour le moment, ou elles seront précisées ultérieurement.</p>
    `;
  }

  return `
<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #333333">Bonjour ${nom} 👋</h2>
    <p style="color: #555555">Nous avons le plaisir de vous informer que vous avez été assigné au rôle suivant dans notre système : <strong>${roleName}</strong>.</p>
    ${featuresTableHtml}
    <p style="color: #555555">Pour en savoir plus sur ce rôle, veuillez consulter votre tableau de bord à l'adresse suivante :</p>
    <p style="padding: 1.5rem 0"><a href="${url}" style="background-color: #e74c3c; color: #ffffff; padding: 15px; text-decoration: none; border-radius: 5px;">Accédez à votre tableau de bord</a></p>
    <p style="color: #555555">Si vous avez des questions ou si vous avez besoin d'assistance, n'hésitez pas à nous contacter.</p>
    <p style="color: #555555">A très bientôt,</p>
    <p style="color: #555555">L'équipe de <a href="${url}" style="color: #e74c3c; text-decoration: none">HostoGest</a></p>
    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0" />
    <p style="color: #999999">Si vous n'attendiez pas l'attribution de ce rôle, merci de nous informer <a href="mailto:akonkwaushindi@gmail.com" style="color: #e74c3c; text-decoration: none">en cliquant ici</a>.</p>
    <p style="color: #999999 text-align: center;">&copy; ${currentYear} HostoGest – Tous droits réservés</p>
  </div>
</div>
`;
};
