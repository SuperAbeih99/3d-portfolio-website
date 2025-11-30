import { WindowProps } from "@/components/WindowManagement/WindowCompositor";
import Image from 'next/image';
import styles from './SkillsView.module.css';
import { useTranslation } from "react-i18next";

function SkillEntry(props: { language: string, icon: { src: string, alt: string }}) {
  const { language, icon } = props;
  
  return (<>
    <div className={styles['language-entry']}>
      <Image
        quality={100}
        draggable={false}
        width={40}
        height={40}
        src={icon.src}
        alt={icon.alt}
      />
      <span>{language}</span>
    </div>
  </>);
}

export default function SkillsView(props: WindowProps) {
  const { t } = useTranslation('common');
  
  return (
    <div className="content-outer">
      <div className="content">
        <div className='content-inner'>
          <div className={styles['skills-content']}>
            <h1>{ t("skills.programming_languages") }</h1>

            <ul>
              <li><SkillEntry language="TypeScript" icon={{src: '/icons/skills/typescript.svg', alt: 'TypeScript' }} /></li>
              <li><SkillEntry language="JavaScript" icon={{src: '/icons/skills/javascript.svg', alt: 'JavaScript' }} /></li>
              <li><SkillEntry language="C++" icon={{src: '/icons/skills/cpp.svg', alt: 'C++' }} /></li>
              <li><SkillEntry language="Python" icon={{src: '/icons/skills/python.svg', alt: 'Python' }} /></li>
              <li><SkillEntry language="HTML" icon={{src: '/icons/skills/html.svg', alt: 'HTML' }} /></li>
              <li><SkillEntry language="CSS" icon={{src: '/icons/skills/css3.svg', alt: 'CSS' }} /></li>
            </ul>

            <h1>{ t("skills.frameworks") }</h1>
            <ul>
              <li><SkillEntry language="React" icon={{src: '/icons/skills/react.svg', alt: 'React' }} /></li>
              <li><SkillEntry language="Next.js" icon={{src: '/icons/skills/nextjs-icon.svg', alt: 'Next.js' }} /></li>
              <li><SkillEntry language="Node.js" icon={{src: '/icons/skills/nodejs.svg', alt: 'Node.js' }} /></li>
              <li><SkillEntry language="Express" icon={{src: '/icons/skills/expressjs.svg', alt: 'Express' }} /></li>
              <li><SkillEntry language="Tailwind CSS" icon={{src: '/icons/skills/tailwindcss.svg', alt: 'Tailwind CSS' }} /></li>
              <li><SkillEntry language="Three.js" icon={{src: '/icons/skills/threejs.svg', alt: 'Three.js' }} /></li>
            </ul>

            <h1>{ t("skills.databases") }</h1>
            <ul>
              <li><SkillEntry language="MongoDB" icon={{src: '/icons/skills/mongodb.svg', alt: 'MongoDB' }} /></li>
              <li><SkillEntry language="Supabase" icon={{src: '/icons/skills/supabase.svg', alt: 'Supabase' }} /></li>
            </ul>

            <h1>{ t("skills.tools") }</h1>
            <ul>
              <li><SkillEntry language="Git" icon={{src: '/icons/skills/git.svg', alt: 'Git' }} /></li>
              <li><SkillEntry language="GitHub" icon={{src: '/icons/github-icon.svg', alt: 'GitHub' }} /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
