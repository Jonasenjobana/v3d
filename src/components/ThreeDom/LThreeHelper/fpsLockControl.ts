import type { Camera } from "three";
import { PointerLockControls } from "three/examples/jsm/Addons.js";
interface FPSState {
    moveForward: boolean;
    moveBackward: boolean;
    moveLeft: boolean;
    moveRight: boolean;
    canJump: boolean;
}
export class FpsLockControl extends PointerLockControls {
  config: { gravity: number }
  constructor(camera: Camera, domElement: HTMLElement, config?: {
    gravity: number; // 0则不会下落
  }) {
    super(camera, domElement);
    this.config = config || {
      gravity: 9.8
    };
  }
  state: FPSState = {
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    canJump: false
  }
  connect(): void {
    super.connect();
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
  }
  disconnect(): void {
    super.disconnect();
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
  }
  onKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        this.state.moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        this.state.moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        this.state.moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        this.state.moveRight = true;
        break;

      case "Space":
        // if (this.state.canJump === true) velocity.y += 350;
        this.state.canJump = false;
        break;
    }
  }
  update(delta: number): void {
      super.update(delta);
  }
  onKeyUp(event: KeyboardEvent): void {
    
    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            this.state.moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            this.state.moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            this.state.moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            this.state.moveRight = false;
            break;

    }
  }
}
