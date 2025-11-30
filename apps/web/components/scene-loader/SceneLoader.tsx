import { useEffect, useState, useRef } from "react";
import { LoadingManager } from "three";
import { Renderer, RendererScenes } from "../renderer/Renderer";
import { AssetManager, LoadingProgress, UpdateAction } from "./AssetManager";
import { CablesLoader, DeskLoader, FloorLoader, KeyboardLoader, LightsLoader, MonitorLoader, MouseLoader, HydraLoader, NoopLoader, createRenderScenes, PlantLoader } from "./AssetLoaders";
import { detectWebGL, isDebug, isMobileDevice } from "./util";
import styles from './SceneLoader.module.css';

function createSpacer(source: string, length: number, fill: string = '\xa0') {
  let spacer = '\xa0';

  for (let i = 0; i < length - 1 - source.length; i++) { spacer += fill; }

  return spacer + '\xa0';
}

function OperatingSystemStats() {
  const name = "Abeih Hamani";
  const company = "Hamani Labs";

  const spacer = 16;

  return (<>
    <div>
      <span className={styles['bold']}>{name}</span>
      {createSpacer(name, spacer)}
      <span>Released: april 1998</span>
    </div>
    <div>
      <span className={styles['bold']}>{company}</span>
      {createSpacer(company, spacer)}
      <span>Magi (C)1998 Hamani Labs</span>
    </div>
    <br/>
  </>)
}

function ShowUserMessage(props: { onClick: () => void }) {
  const onClick = props.onClick;
  const [smallWindow, setSmallWindow] = useState(() => isMobileDevice());

  useEffect(() => {
    const handleResize = () => {
      setSmallWindow(isMobileDevice());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (<>
    <div className={styles['user-message']}>
      <div className={styles['user-message-position-container']}>
        <div className={styles['user-message-container']}>
          <h1>Portfolio of Abeih Hamani</h1>
          {smallWindow && <p className={styles['warning']}>WARNING: This portfolio is best experienced on a desktop, laptop or a tablet computer</p>}  
          <p>If you&apos;re interested, you can download my resume from <a href="/assets/resume.pdf" target="_blank">here</a>.</p>
          
          <p>            
            <span className={styles['continue-text']}>Click continue to begin</span>
            <span className={styles['blinking-cursor']}></span>
          </p>
          <div className={styles['button-center-container']}>
            <button onClick={onClick}>Continue</button>
          </div>
        </div>
      </div>
    </div>
  </>);
}

function DisplayWebGLError() {
  return (
    <div className={styles['loading-progress']}>
      <OperatingSystemStats/>
      <div className={styles['error-container']}>
        <h3>ERROR: No WebGL detected</h3>
        <p>WebGL is required to run this site.</p>
        <p>Please enable it or switch to a browser that supports WebGL</p>
        <p>Or if you want to download my CV, you can do so from <a href="/assets/resume.pdf" target="_blank">here</a>.</p>
      </div>
    </div>
  );
}

function DisplayLoadingProgress(props: { loadingProgress: LoadingProgress }) {
  return (<>
    <div className={styles['loading-progress']}>
      <pre className={styles['boot-text']}>
{`Abeih Hamani                Released: April 1998
Hamani Labs                (C) 1998–2025 Hamani Labs

HamaniOS – CCNY Edition – 2025

Core modules
  CS-Student............... Linked
  Web-Developer............ Linked
  AI-Explorer.............. Linked
  Community-Builder........ Linked
  Coach-BensonhurstFC...... Linked

Boot sequence (3/4)
  Connecting to CCNY WiFi.............. OK
  Syncing ColorStack profile........... OK
  Loading CodePath: Applied AI Engine.. QUEUED
  Mounting projects/FinancePal......... OK
  Mounting projects/CareerLink......... OK
  Mounting projects/ResumeBuilder...... OK
  Warming up creativity engine......... OK

System status
  GPU: Focus mode enabled
  CPU: Overthinking disabled
  Mood: Ready to build

Desktop ready.

Press any key or click to enter.`}
      </pre>
    </div>
  </>)
}

function LoadingUnderscore() {
  return (<>
    <div className={styles['loading-underscore']}>
      <span className={styles['blinking-cursor']}></span>
    </div>
  </>);
}


export function SceneLoader() {
  const [loading, setLoading] = useState(true);
  const [showProgress, setShowProgress] = useState(true);
  const [showMessage, setShowMessage] = useState(true);
  const [showLoadingUnderscore, setLoadingUnderscore] = useState(true);
  const bootStartRef = useRef<number>(Date.now());
  const hasCompletedBootRef = useRef<boolean>(false);

  const scenesRef   = useRef<RendererScenes>(createRenderScenes());
  const managerRef  = useRef<AssetManager | null>(null);
  const actions     = useRef<UpdateAction[]>([]);

  const [loadingProgress, setLoadingProgress] = useState<LoadingProgress | null>(null);
  const [supportsWebGL, setSupportsWebGL] = useState<boolean | null>(null);
  
  useEffect(() => {
    const hasWebGL = detectWebGL();
    setSupportsWebGL(hasWebGL);
    if (!hasWebGL) { return; }

    managerRef.current = new AssetManager(scenesRef.current, new LoadingManager())
    const manager = managerRef.current;

    manager.init(isDebug());
    manager.reset();

    manager.add('Linked to Magi-1', NoopLoader());
    manager.add('Linked to Magi-2', NoopLoader());
    manager.add('Linked to Magi-3', NoopLoader());
    manager.add('Loading desk', DeskLoader());
    manager.add('Loading cables', CablesLoader());
    manager.add('Loading mouse', MouseLoader());
    manager.add('Loading lights', LightsLoader());
    manager.add('Loading floor', FloorLoader());
    manager.add('Loading plant', PlantLoader());
    manager.add('Loading Alchemical Hydra', HydraLoader());
    manager.add('Loading keyboard', KeyboardLoader());
    manager.add('Loading monitor', MonitorLoader());

    setLoadingProgress(managerRef.current.loadingProgress());

    const abortController = new AbortController();

    const fetchData = async () => {
      const { updateActions } = await manager.load(abortController.signal, () => {
        setLoadingProgress(manager.loadingProgress());
      });

      if (!abortController.signal.aborted) {
        actions.current = updateActions;
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      abortController.abort();
    }
  }, []);

  useEffect(() => {
    if (!loadingProgress) { return; }

    if (!loadingProgress.isDoneLoading() || hasCompletedBootRef.current) { return; }
    hasCompletedBootRef.current = true;

    const handleCompletion = async () => {
      const elapsed = Date.now() - bootStartRef.current;
      if (elapsed < 3000) {
        await new Promise((resolve) => setTimeout(resolve, 3000 - elapsed));
      }

      if (!isDebug()) {
        setTimeout(() => { setShowProgress(false); }, 100);
        setTimeout(() => {
          setLoadingUnderscore(false);
          if (!isMobileDevice()) { setShowMessage(false); }
        }, 700);
      } else {
        setShowMessage(false);
        setShowProgress(false);
        setLoadingUnderscore(false);
      }
    }

    handleCompletion();
  }, [loadingProgress]);

  if (supportsWebGL === null) { return <></>; }
  if (supportsWebGL === false) { return DisplayWebGLError(); }

  return (<>
    { showProgress && loadingProgress && <DisplayLoadingProgress loadingProgress={loadingProgress}/> }
    { showLoadingUnderscore && <LoadingUnderscore/> }
    { showMessage && <ShowUserMessage onClick={() => setShowMessage(false)}/> }
    <Renderer
      loading={loading}
      showMessage={showMessage}
      
      scenes={scenesRef.current}
      actions={actions.current}
    />
  </>);
};
