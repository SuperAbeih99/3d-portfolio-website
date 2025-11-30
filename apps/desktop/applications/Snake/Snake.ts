import { LocalWindowCompositor } from "@/components/WindowManagement/LocalWindowCompositor";
import { Application, ApplicationConfig, MenuEntry } from "../ApplicationManager";
import { LocalApplicationManager } from "../LocalApplicationManager";
import { SystemAPIs } from "@/components/OperatingSystem";
import { WindowContext, WindowProps } from "@/components/WindowManagement/WindowCompositor";
import { ApplicationEvent } from "../ApplicationEvents";
import dynamic from "next/dynamic";

const View = dynamic<WindowProps>(() => import("./SnakeView"));

export class SnakeConfig implements ApplicationConfig {
  public readonly displayName = "Snake";
  public readonly dockPriority = null;
  public readonly path = "/Applications/";
  public readonly appName = "Snake.app";
  public readonly appIcon = { src: "/icons/snake-game.png", alt: "Snake application" };
  public readonly entrypoint = (
    compositor: LocalWindowCompositor,
    manager: LocalApplicationManager,
    apis: SystemAPIs
  ) => new SnakeApplication(compositor, manager, apis);
}

export const snakeConfig = new SnakeConfig();

export class SnakeApplication extends Application {
  config(): ApplicationConfig {
    return snakeConfig;
  }

  menuEntries(): MenuEntry[] {
    return [
      {
        displayOptions: { boldText: true },
        name: "Snake",
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
        title: "Snake",
        application: this,
        args: event.args,
        generator: () => View,
      });
    }
  }
}
