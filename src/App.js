import React, { Component } from 'react'
import './App.css'
import * as PIXI from 'pixi.js'
import Victor from 'victor'
import Layer from './layer.js'
import { deg2rad, fitBoundsScale, centerRectInRect, fitLayer } from './geometry.js'

// const imageURL = 'https://images.unsplash.com/photo-1483425571841-9662f86c7154?dpr=1&auto=format&fit=crop&w=1500&h=746&q=80&cs=tinysrgb&crop=';
const imageURL = '/image.jpg';

const drawLayer = (layer, color) => {
  const graphics = new PIXI.Graphics()
  const gLayer = new PIXI.Graphics()
  const gImage = new PIXI.Graphics()

  gLayer.interactive = true
  gLayer.hitArea = layer.polygon
  gLayer
    .lineStyle(2 * 1/layer.scale, color)
    .drawPolygon(layer.polygon)
    .closePath()
    .transform.setFromMatrix(layer.matrix)

  if (layer.sprite) {
    layer.sprite.setTransform(
      layer.center.x, layer.center.y,
      layer.width / layer.sprite.texture.width * layer.scale,
      layer.height / layer.sprite.texture.height * layer.scale,
      deg2rad(layer.rotation), 0, 0,
      layer.sprite.texture.width / 2, layer.sprite.texture.height / 2
    )

    if (layer.mask) {
      const mask = new PIXI.Graphics()
      mask.beginFill()
      mask.drawPolygon(layer.mask.polygon)
      mask.transform.setFromMatrix(layer.mask.matrix)

      gImage.mask = mask
      gImage.addChild(mask)
    }

    gImage.addChild(layer.sprite)
  }

  graphics.addChild(gImage)
  graphics.addChild(gLayer)

  return graphics
}

class App extends Component {

	componentDidMount() {
    this.app = new PIXI.Application(500, 500, { view: this.canvas, antialias: true })
    this.renderer = this.app.renderer
    this.stage = this.app.stage

    this.renderer.autoResize = true
    this.renderer.resize(window.innerWidth, window.innerHeight)
    window.addEventListener('resize', this.handleResize)
    this.renderer.plugins.interaction
      .on('pointerdown', this.handleDown)
      .on('pointermove', this.handleMove)
      .on('pointerup', this.handleUp)

    this.layer = new Layer(200, 150, 150, 100, 40)

    PIXI.loader
      .add(imageURL, { crossOrigin: true })
      .load((loader, resources) => {
        const imageTexture = resources[imageURL].texture
        const imageSprite = new PIXI.Sprite(imageTexture)
        const fitScale = fitBoundsScale(imageSprite.getBounds(), this.layer.polygonBounds.getRectangle())

        this.image = new Layer(0, 0, imageSprite.width * fitScale, imageSprite.height * fitScale, 40)
        this.image.mask = this.layer
        centerRectInRect(this.image, this.layer)
        this.image.pivot = this.layer.center
        this.image.sprite = imageSprite

        this.stage.addChild(drawLayer(this.image, 0x00FF00))
        this.stage.addChild(drawLayer(this.layer, 0x00AAFF))
      })

    this.app.start()
  }

  handleDown = (event) => {
    const p = new Victor(event.data.global.x, event.data.global.y)
    const center = new Victor(this.layer.center.x, this.layer.center.y)

    this.downPoint = p.subtract(center)
  }

  handleMove = (event) => {
    if (this.downPoint) {
      const p = new Victor(event.data.global.x, event.data.global.y)
      const center = new Victor(this.layer.center.x, this.layer.center.y)
      const vector = p.subtract(center)
      const angleDiff = vector.angleDeg() - this.downPoint.angleDeg()

      this.image.rotation = this.image.rotation + angleDiff

      fitLayer(this.image, this.layer)

      this.downPoint = vector

      this.stage.removeChildren()
      this.stage.addChild(drawLayer(this.image, 0x00FF00))
      this.stage.addChild(drawLayer(this.layer, 0x00AAFF))
    }
  }

  handleUp = (event) => {
    this.downPoint = null
  }

  handleResize = () => {
    this.renderer.resize(window.innerWidth, window.innerHeight)
  };

  render() {
    return (
      <canvas ref={c => this.canvas = c} />
    );
  }
}

export default App
