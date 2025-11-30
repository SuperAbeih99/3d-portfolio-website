import { LocalWindowCompositor } from "@/components/WindowManagement/LocalWindowCompositor";
import { Application, ApplicationConfig, MenuEntry } from "../ApplicationManager";
import { LocalApplicationManager } from "../LocalApplicationManager";
import { SystemAPIs } from "@/components/OperatingSystem";
import { WindowContext, WindowProps } from "@/components/WindowManagement/WindowCompositor";
import { ApplicationEvent } from "../ApplicationEvents";
import dynamic from "next/dynamic";

const View = dynamic<WindowProps>(() => import("./MemesView"));

export class MemesConfig implements ApplicationConfig {
  public readonly displayName = "Memes";
  public readonly dockPriority = null;
  public readonly path = "/Applications/";
  public readonly appName = "Memes.app";
  public readonly appIcon = { src: "/icons/decent-memes.png", alt: "Memes application" };
  public readonly entrypoint = (
    compositor: LocalWindowCompositor,
    manager: LocalApplicationManager,
    apis: SystemAPIs
  ) => new MemesApplication(compositor, manager, apis);
}

export const memesConfig = new MemesConfig();

export class MemesApplication extends Application {
  config(): ApplicationConfig {
    return memesConfig;
  }

  menuEntries(): MenuEntry[] {
    return [
      {
        displayOptions: { boldText: true },
        name: "Memes",
        items: [],
      },
    ];
  }

  on(event: ApplicationEvent, windowContext?: WindowContext | undefined): void {
    this.baseHandler(event, windowContext);

    if (event.kind === "application-open") {
      const width = 520;
      const height = 640;
      const x = (window.innerWidth - width) / 2;
      const y = 120;

      this.compositor.open({
        x,
        y,
        width,
        height,
        title: "Memes",
        application: this,
        args: event.args,
        generator: () => View,
      });
    }
  }
}
