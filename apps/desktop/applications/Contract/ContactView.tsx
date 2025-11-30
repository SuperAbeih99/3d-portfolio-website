import { WindowProps } from "@/components/WindowManagement/WindowCompositor";
import { useTranslation } from "react-i18next";
import styles from './ContactView.module.css';
import { FormEvent, useEffect, useRef, useState } from "react";
import { isEmail, isEmpty } from "@/components/util";
import Image from 'next/image';

type ValidationError = (
  'empty-name' |
  'empty-email' |
  'empty-message' |
  'invalid-email'
);


function ContactIntro() {
  return (<>
    <p className={styles['contact-info']}>
      I’m currently a Computer Science undergraduate student here in New York. If you’d like to talk about internship opportunities, projects, or anything tech-related, feel free to reach out by email or through the form below.
    </p>

    <p><b>Email:&nbsp;</b><a href="mailto:abeihhamani24@gmail.com">abeihhamani24@gmail.com</a></p>
  </>);
}

export default function ContactApplicationView(props: WindowProps) {
  const { application, args, windowContext } = props;
  const nameRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation('common');

  const [inputFields, setInputFields] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const [errors, setErrors] = useState<Set<ValidationError>>(new Set());
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleChange(e: any) {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  } 

  function resetInput() {
    setInputFields({
      name: "",
      email: "",
      company: "",
      message: ""
    })
  }

  async function sendEmail() {
    const data = new FormData();
    data.append("name", inputFields.name);
    data.append("email", inputFields.email);
    data.append("message", inputFields.message);
    if (!isEmpty(inputFields.company)) {
      data.append("company", inputFields.company);
    }
    data.append("_subject", "New Contact Form Submission - Portfolio");
    data.append("_replyto", inputFields.email);
    data.append("_captcha", "false");
    data.append("_template", "table");

    const response = await fetch("https://formsubmit.co/ajax/abeihhamani24@gmail.com", {
      method: 'POST',
      headers: { Accept: "application/json" },
      body: data,
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }
  }

  function isFormValid(): boolean {
    return validateForm().length === 0;
  }

  function validateForm(): ValidationError[] {
    let errors: ValidationError[] = [];

    if (isEmpty(inputFields.name)) { errors.push('empty-name'); }
    if (isEmpty(inputFields.email)) { errors.push('empty-email'); }
    if (isEmpty(inputFields.message)) { errors.push('empty-message'); }

    if (!isEmail(inputFields.email)) { errors.push('invalid-email'); }
    
    return errors;
  }

  function handleFromErrors() {
    const errors = validateForm();

    function setError(error: ValidationError) {
      setErrors(errors => new Set(errors).add(error));
    }

    for (const error of errors) {
      setError(error);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();

    setIsSubmitting(true);
    setIsSubmitted(false);
    setSubmitError(null);

    if (isFormValid()) {
      sendEmail()
        .then(() => {
          setIsSubmitted(true);
          resetInput();
          setErrors(new Set());
        })
        .catch(() => {
          setSubmitError("Failed to send message. Please try again.");
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      handleFromErrors();
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (!nameRef.current) { return; }

    nameRef.current.focus();
  }, []);

  return (
    <div className="content-outer">
      <div className="content">
        <div className={styles['center']}>
          <div className={styles['contact-card']}>
            <div className={styles['center-content']}>
              <div className={styles['contact-header']}>
                <div>
                  <p className={styles['eyebrow']}>Let’s talk</p>
                  <h1>Contact</h1>
                </div>
                <div className={styles['contact-socials']}>
                  <a rel="noreferrer" target="_blank" href="https://github.com/SuperAbeih99"><Image src="icons/github-icon.svg" alt="Github" width={22} height={22}/></a>
                  <a rel="noreferrer" target="_blank" href="https://www.linkedin.com/in/abeih"><Image src="icons/linkedin-icon.svg" alt="Linkedin" width={22} height={22}/></a>
                </div>
              </div>
              <ContactIntro />
              <form className={styles.form} onSubmit={onSubmit}>
                { isSubmitted ?
                  <div className={[styles['form-row'], styles['processed']].join(' ')}>
                    <span>{t("contact.processed")}</span>
                    <button
                      type="button"
                      className="system-button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setSubmitError(null);
                      }}
                    >
                      Send Another Message
                    </button>
                  </div> : <></>
                }
                
                <div className={styles['form-row']}>
                  <label className={styles['label']} htmlFor="name"><span className={styles.required}>*</span>{t("contact.name")}</label>
                  <input
                    className={`${styles['input-control']} system-text-input`}
                    ref={nameRef}
                    id="name"
                    type="text"
                    name="name"
                    disabled={isSubmitting}
                    placeholder={t("contact.name")}
                    value={inputFields.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles['form-row']}>
                  <label className={styles['label']} htmlFor="email"><span className={styles.required}>*</span>{t("contact.email")}</label>
                  <input
                    className={`${styles['input-control']} system-text-input`}
                    id="email"
                    type="email"
                    name="email"
                    disabled={isSubmitting}
                    placeholder={t("contact.email")}
                    value={inputFields.email}
                    onChange={handleChange}
                  />
                  { errors.has('invalid-email') ? <span className={styles['error']}>{t('contact.error.invalid-email')}</span> : <></> }
                </div>

                <div className={styles['form-row']}>
                  <label className={styles['label']} htmlFor="company">{t("contact.company_optional")}</label>
                  <input
                    className={`${styles['input-control']} system-text-input`}
                    id="company"
                    type="text"
                    name="company"
                    disabled={isSubmitting}
                    placeholder={t("contact.company")}
                    value={inputFields.company}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles['form-row']}>
                  <label className={styles['label']} htmlFor="message"><span className={styles.required}>*</span>{t("contact.message")}</label>
                  <textarea
                    className={`${styles['input-control']} ${styles['textarea']} system-text-input`}
                    id="message"
                    name="message"
                    disabled={isSubmitting}
                    placeholder={t("contact.message")}
                    value={inputFields.message}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div className={[styles['form-row'], styles['submit-row']].join(' ')}>
                  <button
                    type="submit"
                    className={`${styles['submit-button']} system-button`}
                    disabled={!isFormValid() || isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : t("contact.send")}
                  </button>
                  {submitError ? <span className={styles['error']}>{submitError}</span> : null}
                  
                  <div className={styles['instructions']}>
                    <span>{t("contact.message_forwarding_instructions")}</span>
                    <span className={styles['required-instructions']}><span className={styles.required}>*</span> = {t("contact.required")}</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
