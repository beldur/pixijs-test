
export const deg2rad = (deg) => deg * Math.PI / 180
export const rad2deg = (rad) => rad * 180 / Math.PI

export const fitScale = (fit, into) => {
  const addHeight = Math.max(fit.minY - into.minY, into.maxY - fit.maxY)
  const addWidth = Math.max(fit.minX - into.minX, into.maxX - fit.maxX)
  const fitRect = fit.getRectangle()
  const scale = Math.max(addHeight / fitRect.height, addWidth / fitRect.width)

  return 1 + scale * 2
}

export const fitLayer = (fit, into) => {
    const imageRotation = fit.rotation
    into.rotation -= imageRotation
    fit.rotation -= imageRotation

    const imageScale = fitScale(fit.bounds, into.bounds)
    fit.scale *= imageScale

    into.rotation += imageRotation
    fit.rotation += imageRotation
}

export const fitBoundsScale = (fit, bounds) => {
  const fitBounds = fit
  const fitRatio = fitBounds.height / fitBounds.width
  const boundsRatio = bounds.height / bounds.width
  const scale = (fitRatio > boundsRatio) ? bounds.width / fitBounds.width : bounds.height / fitBounds.height

  return scale
}

export const centerRectInRect = (rect, rectBounds) => {
  rect.x = rectBounds.x - (rect.width - rectBounds.width) / 2
  rect.y = rectBounds.y - (rect.height - rectBounds.height) / 2
}
