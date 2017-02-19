import * as PIXI from 'pixi.js'
import { deg2rad } from './geometry.js'

class Layer {
  constructor(x, y, width, height, rotation = 0) {
    this.width = width
    this.height = height
    this._x = x
    this._y = y
    this.rotation = rotation
    this.scale = 1
    this.pivot = this.center

    this.polygon = this.createPolygon(x, y, width, height)
    this.maskLayer = null
  }

  createPolygon(x = this._x, y = this._y, width = this.width, height = this.height) {
    return new PIXI.Polygon(
      x, y,
      x + width, y,
      x + width, y + height,
      x, y + height,
    )
  }

  set x(x) {
    this._x = x
    this.polygon = this.createPolygon()
  }

  set y(y) {
    this._y = y
    this.polygon = this.createPolygon()
  }

  get x() { return this._x }
  get y() { return this._y }
  get halfWidth() { return this.width / 2 }
  get halfHeight() { return this.height / 2 }

  get center() {
    return new PIXI.Point(this.x + this.halfWidth, this.y + this.halfHeight)
  }

  get matrix() {
    const matrix = new PIXI.Matrix()
    const center = this.center
    const pivot = this.pivot
    const rotation = deg2rad(this.rotation)

    matrix.setTransform(center.x, center.y, -1 * center.x, -1 * center.y, this.scale, this.scale, 0, 0, 0)
    matrix.translate(-pivot.x, -pivot.y)
    matrix.rotate(rotation)
    matrix.translate(pivot.x, pivot.y)

    return matrix
  }

  get bounds() {
    const bounds = new PIXI.Bounds()
    const matrix = this.matrix

    for (let i = 0; i < this.polygon.points.length; i += 2) {
      bounds.addPoint(matrix.apply(
        new PIXI.Point(
          this.polygon.points[i],
          this.polygon.points[i + 1],
        )
      ))
    }

    return bounds
  }

  get polygonBounds() {
    const bounds = new PIXI.Bounds()

    for (let i = 0; i < this.polygon.points.length; i += 2) {
      bounds.addPoint(new PIXI.Point(
          this.polygon.points[i],
          this.polygon.points[i + 1],
      ))
    }

    return bounds
  }
}

export default Layer
