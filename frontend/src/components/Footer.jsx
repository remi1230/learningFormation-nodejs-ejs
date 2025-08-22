// components/footer/Footer.jsx
import SocialIcon from './ui-kit/SocialIcon';
import { FaFacebook, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  return (
    <div className="bg-base-200/80 backdrop-blur-md shadow-md">
        <footer className="footer max-w-screen-xl mx-auto sm:footer-horizontal items-center py-10 2xl:px-0 px-4 justify-center md:justify-between">
            <nav className="flex flex-col items-start gap-5">
                <div className="flex flex-row items-center gap-y-5 gap-x-2 text-lg">
                    <div>Robert Dubois</div>
                </div>
                <div>&copy; {new Date().getFullYear()} Robert Dubois. Tous droits réservés.</div>
            </nav>
            <nav>
                <div className="text-xl">Coordonnées</div>
                <div>12, rue des Aubépines</div>
                <div>18000 Bourges</div>
            </nav>
            <nav className="flex flex-row items-center gap-2">
                <SocialIcon to="https://x.com/i/flow/login">
                    <FaXTwitter size={18} />
                </SocialIcon>
                <SocialIcon to="https://www.facebook.com/">
                    <FaFacebook size={18} />
                </SocialIcon>
                <SocialIcon to="https://www.linkedin.com/">
                    <FaLinkedin size={18} />
                </SocialIcon>
            </nav>
        </footer>
    </div>
  );
}