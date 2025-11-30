import { RefObject, useEffect, useRef, useState } from "react";
import { CameraHandler, CameraHandlerState } from "./camera/CameraHandler";
import { joinStyles, writeOutChars, writeOutCharsStreaming } from "./util";
import styles from "./RendererUI.module.css"
import { SoundService } from "./sound/SoundService";

const MStoWriteChar = 35;

function useSoundManagement(soundService: SoundService) {
  const [isSoundEnabled, setSoundEnabled] = useState(true);

  function toggleSound() {
    if (isSoundEnabled) {
      disableSound();
    } else {
      enableSound();
    }
  }

  function enableSound() {
    setSoundEnabled(true);
    soundService.enable();
  }

  function disableSound() {
    setSoundEnabled(false);
    soundService.disable(); 
  }

  return {isSoundEnabled, toggleSound, enableSound, disableSound};
}

export type RendererUIProps = {
  cameraHandlerState: CameraHandlerState,
  cameraHandler: RefObject<CameraHandler | null>,
  soundService: SoundService
}

type SubViewSound = {
  isSoundEnabled: boolean,
  toggleSound: () => void
}

type ElementStateProps = {
  state: CameraHandlerState
}

type SubViewProps = {
  state: CameraHandlerState,
  sound: SubViewSound,
}



function SoundManagementButton(props: { sound: SubViewSound }) {
  const { isSoundEnabled, toggleSound } = props.sound;

  const icon = isSoundEnabled ? "/icons/mute-icon.svg" : "/icons/unmute-icon.svg"

  return (
    <button className={styles['mute-button']} onClick={() => toggleSound()}>
      <img draggable={false} src={icon} width={25} height={20}/>
    </button>
  )
}

function ChangeSceneButton(props: { targetState: CameraHandlerState, cameraHandler: RefObject<CameraHandler | null> }) {
  const icon = "/icons/camera.svg";

  const { targetState, cameraHandler } = props;

  function changeScene() {
    if (!cameraHandler.current) { return; }
    cameraHandler.current.changeState(targetState);
  }

  return (
    <button className={styles['camera-button']} onClick={() => changeScene()}>
      <img draggable={false} src={icon} width={25} height={20}/>
    </button>
  );
}

function NameAndTime(props: {
  state: CameraHandlerState,
  cameraHandler: RefObject<CameraHandler | null>,
  sound: SubViewSound,
}) {
  const { state, cameraHandler, sound } = props;

  const firstTime = useRef<boolean>(true);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  const [done, setDone] = useState(false);

  const isActive = state === CameraHandlerState.FreeRoam;

  function formatTime(dateTime: Date): string {
    const hours24 = dateTime.getHours();
    const minutes = String(dateTime.getMinutes()).padStart(2, '0');
    const hours12 = hours24 % 12 || 12;
    const suffix = hours24 >= 12 ? 'PM' : 'AM';

    return `${hours12}:${minutes} ${suffix}`;
  }

  function writeOutContent() {
    function writeAfterDelay(stream: () => string, setter: (value: string) => void, charDelay: number): void {
      setTimeout(() => writeOutCharsStreaming(stream, setter, MStoWriteChar), charDelay * MStoWriteChar);
    }

    const name = "Abeih Hamani";
    const title = "Computer science student";
    const initialTime = formatTime(new Date());

    // Write all the content
    writeAfterDelay(() => name, setName, 0);
    writeAfterDelay(() => title, setTitle, name.length + 1);
    writeAfterDelay(() => initialTime, setTime, name.length + title.length + 2);

    // After everything is done writing, start a loop to update the time
    const totalWaitTime = (initialTime.length + name.length + title.length + 2) * MStoWriteChar;

    setTimeout(() => {
      setInterval(() => { setTime(formatTime(new Date())); }, 1000);
    }, totalWaitTime);

    setTimeout(() => {
      setDone(true);
    }, totalWaitTime + MStoWriteChar);
  }

  useEffect(() => {
    if (!isActive) { return; }
    const isFirstTime = firstTime.current;

    if (isFirstTime) {
      writeOutContent();
      firstTime.current = false;
    }
  }, [state])

  return (
    <div
      className={joinStyles([
        styles['name-container'],
        isActive ? styles['fade-in'] : styles['fade-out']
      ])}
    >
      <div className={styles['identity']}>
        {name && <span className={styles['identity-name']}>{name}</span>}
        {title && <span className={styles['identity-title']}>{title}</span>}
      </div>
      <div className={styles['status-meta']}>
        {time && (
          <span className={joinStyles([
            styles['status-clock'],
            done ? styles['time-is-done'] : null
          ])}>
            {time}
          </span>
        )}
        {done && (
          <div className={styles['status-actions']}>
            <SoundManagementButton sound={sound}/>
            <ChangeSceneButton targetState={CameraHandlerState.MonitorView} cameraHandler={cameraHandler}/>
          </div>
        )}
      </div>
    </div>
  );
}

function UserInteractionButtons(props: {
  state: CameraHandlerState,
  cameraHandler: RefObject<CameraHandler | null>,
  sound: SubViewSound,
}) {
  const { state, cameraHandler, sound } = props;

  const isActive = (
    state === CameraHandlerState.Cinematic ||
    state === CameraHandlerState.MonitorView 
  );

  return (<>
    <div className={joinStyles([
        styles['sound-container'],
        !isActive ? styles['fade-out'] : null
      ])}>
        <SoundManagementButton sound={sound}/>
        <ChangeSceneButton targetState={state === CameraHandlerState.Cinematic ? CameraHandlerState.MonitorView : CameraHandlerState.Cinematic} cameraHandler={cameraHandler}/>
    </div>
  </>);
}

function CinematicInstructions(props: SubViewProps) {
  const { state } = props;

  const [instructions, setInstructions] = useState("");

  const isActive = state === CameraHandlerState.Cinematic;

  useEffect(() => {
    if (!isActive) { return; }

    const cancelation = writeOutChars("Click anywhere to start", setInstructions, MStoWriteChar);

    return () => { cancelation(); }

  }, [state]);

  return (<>
    <div className={styles['cinematic-container']}>
      <span className={joinStyles([
        styles['cinematic-instructions'],
        !isActive ? styles['fade-out'] : null,
      ])}>{instructions}<span className={styles['blinking-cursor']}></span></span>
    </div>
  </>);
}

export function RendererUI(props: RendererUIProps) {
  const { cameraHandlerState, cameraHandler, soundService } = props;
  const soundManagement = useSoundManagement(soundService);

  // A switch statement wrapped in a function breaks the rules of hooks, but this doesn't?
  // Just looks ugly, but it works
  return (
    <div className={styles['ui']}>
      <UserInteractionButtons state={cameraHandlerState} cameraHandler={cameraHandler} sound={soundManagement} />
      <NameAndTime state={cameraHandlerState} cameraHandler={cameraHandler} sound={soundManagement} />
      <CinematicInstructions state={cameraHandlerState} sound={soundManagement} />
    </div>
  );
}
