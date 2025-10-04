import React from 'react';

const PrivacyPolicyContent = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Politique de confidentialité</h1>
      <p>
        Chez L'HOMME, nous prenons la protection de vos données personnelles très au sérieux. Cette politique explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre site.
      </p>
      <h2 className="text-xl font-semibold">1. Données collectées</h2>
      <p>
        Nous collectons les informations suivantes :
        <ul className="list-disc pl-6">
          <li>Informations techniques (adresse IP, type de navigateur, appareil utilisé).</li>
          <li>Données de navigation (pages visitées, durée de session).</li>
        </ul>
      </p>
      <h2 className="text-xl font-semibold">2. Utilisation des données</h2>
      <p>
        Vos données sont utilisées pour :
        <ul className="list-disc pl-6">
          <li>Améliorer votre expérience utilisateur.</li>
          <li>Assurer la sécurité de notre site.</li>
          <li>Analyser les performances du site.</li>
        </ul>
      </p>
      <h2 className="text-xl font-semibold">3. Partage des données</h2>
      <p>
        Vos données ne sont pas partagées avec des tiers, sauf si requis par la loi.
      </p>
      <h2 className="text-xl font-semibold">4. Sécurité</h2>
      <p>
        Nous mettons en place des mesures de sécurité techniques et organisationnelles pour protéger vos données.
      </p>
      <h2 className="text-xl font-semibold">5. Vos droits</h2>
      <p>
        Vous avez le droit d'accéder, de rectifier ou de supprimer vos données. Pour exercer ces droits, contactez-nous à <a href="mailto:contact@lhomme-cg.com">contact@lhomme-cg.com</a> .
      </p>
      <h2 className="text-xl font-semibold">6. Contact</h2>
      <p>
        Pour toute question concernant cette politique, contactez-nous à <a href="mailto:contact@lhomme-cg.com">salon@lhomme-cg.com</a> .
      </p>
    </div>
  );
};

export default PrivacyPolicyContent;