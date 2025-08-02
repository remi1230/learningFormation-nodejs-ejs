// src/pages/Home.jsx
import Caroussel from '../components/ui-kit/Caroussel.jsx';


export default function Home() {
  return (
    <section className="">
      <div className="text-4xl font-bold">Cabinet du docteur Dupont</div>
      <div className="card w-full">
        <figure className="mt-0 mb-0">
            <Caroussel interval={5000}/>
        </figure>
        <div className="card card-body">
            <p className="text-2xl font-bold">
                Plus qu'un sourire, c'est une vie que nous réparons !
            </p>
            <p className="text-justify prose-lg">
                Situé au cœur de la ville, le cabinet du Docteur Dupont vous accueille dans un environnement moderne,
                apaisant et équipé des dernières technologies pour vous offrir des soins dentaires de haute qualité.
            </p>
            <p className="text-justify prose-lg">
                Le Dr Dupont, chirurgien-dentiste expérimenté et à l’écoute, met un point d’honneur à proposer des traitements personnalisés, adaptés aux besoins de chaque patient, qu’il s’agisse de soins préventifs, de soins conservateurs, d’esthétique dentaire ou de chirurgie.
            </p>
            <p className="text-justify prose-lg">
                Notre équipe vous accompagne avec bienveillance à chaque étape de votre parcours de soins, dans une atmosphère chaleureuse et professionnelle.
            </p>
            <p className="text-justify prose-lg">
                Souhaitez-vous que le texte soit plus court, plus technique, ou rédigé en langage institutionnel ou marketing ? Je peux aussi le décliner en version accroche pour site web ou présentation brochure.
            </p>
        </div>
      </div>
    </section>
  );
}