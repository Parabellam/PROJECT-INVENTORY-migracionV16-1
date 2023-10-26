import { AfterViewInit, Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-moleculas',
  templateUrl: './moleculas.component.html',
  styleUrls: ['./moleculas.component.css'],
})
export class MoleculasComponent implements AfterViewInit {
  //Moléculas
  cursorPosition = { x: 0, y: 0 };
  moleculeCenters: { [key: string]: { x: number; y: number } } = {};

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.randomMoleculePosition();
  }

  randomMoleculePosition() {
    const container = this.el.nativeElement.querySelector('.molecule-wrapper');
    const molecules = container.getElementsByClassName('molecule');

    container.addEventListener('mousemove', (event: MouseEvent) => {
      this.cursorPosition.x = event.clientX;
      this.cursorPosition.y = event.clientY;
    });

    const moleculeRect = molecules[0].getBoundingClientRect();
    const moleculeWidth = moleculeRect.width;
    const moleculeHeight = moleculeRect.height;

    for (let i = 0; i < molecules.length; i++) {
      const randomX1 = Math.random() * 200;
      const randomY1 = Math.random() * 200;
      const randomX2 = Math.random() * 200;
      const randomY2 = Math.random() * 200;
      const randomX3 = Math.random() * 200;
      const randomY3 = Math.random() * 200;

      const initialTop = Math.random() * 100;
      const initialLeft = Math.random() * 100;

      molecules[i].style.setProperty('--random-x1', randomX1);
      molecules[i].style.setProperty('--random-y1', randomY1);
      molecules[i].style.setProperty('--random-x2', randomX2);
      molecules[i].style.setProperty('--random-y2', randomY2);
      molecules[i].style.setProperty('--random-x3', randomX3);
      molecules[i].style.setProperty('--random-y3', randomY3);

      molecules[i].style.top = `${initialTop}%`;
      molecules[i].style.left = `${initialLeft}%`;

      const moleculeCenter = {
        x: initialLeft + moleculeWidth / 2,
        y: initialTop + moleculeHeight / 2,
      };
      this.moleculeCenters[`molecule${i}`] = moleculeCenter;

      molecules[i].addEventListener('mouseover', () =>
        this.startAnimation(molecules[i], `molecule${i}`)
      );
    }
  }

  startAnimation(molecule: HTMLElement, moleculeId: string) {
    const duration = 1000; // Adjust this value to control the duration of the animation (in milliseconds)
    const startTime = performance.now();

    const initialTop = parseFloat(molecule.style.top);
    const initialLeft = parseFloat(molecule.style.left);

    const targetTop = Math.random() * 100;
    const targetLeft = Math.random() * 100;

    const animate = (timestamp: number) => {
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // Calculate the animation progress between 0 and 1

      const currentTop = initialTop + (targetTop - initialTop) * progress;
      const currentLeft = initialLeft + (targetLeft - initialLeft) * progress;

      molecule.style.top = `${currentTop}%`;
      molecule.style.left = `${currentLeft}%`;

      if (progress < 1) {
        requestAnimationFrame(animate); // Continue the animation
      } else {
        // Update the molecule center coordinates at the end of the animation
        const moleculeRect = molecule.getBoundingClientRect();
        const moleculeCenter = {
          x: moleculeRect.left + moleculeRect.width / 2,
          y: moleculeRect.top + moleculeRect.height / 2,
        };
        this.moleculeCenters[moleculeId] = moleculeCenter;

        // Reset the opacity after the animation is complete
        setTimeout(() => {
          molecule.style.opacity = '1';
        }, 100);
      }
    };

    requestAnimationFrame(animate);
  }
}
