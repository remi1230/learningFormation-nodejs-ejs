// components/footer/Footer.jsx
import SocialIcon from './ui-kit/SocialIcon';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <div className="bg-base-200/80 backdrop-blur-md shadow-md">
        <footer className="footer max-w-screen-xl mx-auto sm:footer-horizontal items-center py-10 2xl:px-0 px-4 justify-center md:justify-between">
            <nav className="flex flex-col items-start gap-5">
                <div className="flex flex-row items-center gap-y-5 gap-x-2 text-lg">
                    <div>Rémi Tafforeau</div>
                </div>
                <div>&copy; {new Date().getFullYear()} Rémi Tafforeau. Tous droits réservés.</div>
            </nav>
            <nav>
                <div className="text-xl">Coordonnées</div>
                <div>Région Centre-Val de Loire</div>
                <div>Ville de Bourges</div>
            </nav>
            <nav className="flex flex-row items-center gap-2">
                <SocialIcon href="https://github.com/remi1230">
                    <FaGithub size={18} />
                </SocialIcon>
                <SocialIcon href="https://www.linkedin.com/in/r%C3%A9mi-tafforeau/">
                    <FaLinkedin size={18} />
                </SocialIcon>
                <SocialIcon href="/assets/documents/CV-Formateur-Rémi-Tafforeau.pdf">
                    <span className="font-semibold text-sm">CV</span>
                </SocialIcon>
            </nav>
        </footer>
    </div>
  );
}