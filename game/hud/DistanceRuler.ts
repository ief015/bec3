import GameEventHandler from "~/game/GameEventHandler";
import { calcFriendlyDistance } from "~/game/simulation/utils/calcFriendlyDistance";

export default class DistanceRuler extends GameEventHandler {

  public onPostUpdate(dt: number) {

  }

  public onPostDraw(ctx: CanvasRenderingContext2D, dt: number) {
    const cam = this.getCamera();
    const zoom = cam.getZoom();

    const screenWidth = ctx.canvas.width;
    const screenHeight = ctx.canvas.height;

    const baseRulerLength = 200;

    const rulerStart = { x: screenWidth - baseRulerLength - 100, y: screenHeight - 20 };
    const rulerEnd = { x: rulerStart.x + baseRulerLength, y: rulerStart.y };

    const { x: startX, y: startY } = cam.toWorldSpace(rulerStart);
    const { x: endX, y: endY } = cam.toWorldSpace(rulerEnd);
    
    const dx = endX - startX;
    const dy = endY - startY;

    const distanceMeters = Math.sqrt(dx * dx + dy * dy);
    const { distance, unit } = calcFriendlyDistance(distanceMeters);

    ctx.save();
    ctx.resetTransform();
    ctx.translate(rulerStart.x, rulerStart.y);

    ctx.strokeStyle = '#A6ADBA';
    ctx.fillStyle = '#A6ADBA';
    ctx.font = '12px sans-serif';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;
    ctx.lineWidth = 2;
  
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.lineTo(0, 0);
    ctx.lineTo(baseRulerLength, 0);
    ctx.lineTo(baseRulerLength, 5);
    ctx.stroke();

    const formatter = Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 });

    ctx.translate(0, -5);
    ctx.fillText(`${formatter.format(distance)} ${unit}`, 0, 0);

    const zoomFactor = zoom >= 1 ? zoom : 1 / zoom;
    const zoomLabel = `${zoom >= 1 ? '' : '1 / '}${formatter.format(zoomFactor)} x`;
    const zoomLabelWidth = ctx.measureText(zoomLabel).width;
    ctx.fillText(zoomLabel, baseRulerLength - zoomLabelWidth, 0);

    ctx.restore();
  }

}