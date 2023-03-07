const getImagePortion = (imgObj: any, boxesArr: any) => {
    const W2 = boxesArr[2] - boxesArr[0]
    const H2 = boxesArr[3] - boxesArr[1]
    const canvas = document.createElement('canvas');
    canvas.width = W2;
    canvas.height = H2;
    const bufferCanvas = document.createElement('canvas');
    bufferCanvas.width = imgObj.width;
    bufferCanvas.height = imgObj.height;
    bufferCanvas?.getContext('2d')?.drawImage(imgObj, 0, 0, imgObj.width, imgObj.height);
    canvas?.getContext('2d')?.drawImage(bufferCanvas, boxesArr[0], boxesArr[1], W2, H2,0, 0, W2, H2); //将图片绘制到canvas中
    return canvas.toDataURL();
}

export const getImgBox = (o: any, box: any) => {
    // 获取原图宽高
    const CONSTANT = 400;
    const height = o.height;
    const width = o.width;
    const BIGIMAGEWIDTH = (height >= width ? width / height : 1) * CONSTANT;
    const BIGIMAGEHEIGHT = (height < width ? height / width : 1) * CONSTANT;
    const DIFFWidth = (CONSTANT - BIGIMAGEWIDTH) / 2;
    const DIFFHeight = (CONSTANT - BIGIMAGEHEIGHT) / 2;
    const boxesArr = box.split(',');
  
    // imgSize.value.width = BIGIMAGEWIDTH
    // imgSize.value.height = BIGIMAGEHEIGHT
  
    const leftNum = (Number(boxesArr[0]) / width) * BIGIMAGEWIDTH + DIFFWidth;
    const left = leftNum + 'px';
    const topNum = (Number(boxesArr[1]) / height) * BIGIMAGEHEIGHT + DIFFHeight;
    const top = topNum + 'px';
    const tWidthNum = ((Number(boxesArr[2]) - Number(boxesArr[0])) / width) * BIGIMAGEWIDTH;
    const tWidth = tWidthNum + 'px';
    const tHeightNum = ((Number(boxesArr[3]) - Number(boxesArr[1])) / height) * BIGIMAGEHEIGHT;
    const tHeight = tHeightNum + 'px';
    const rightNum = leftNum + tWidthNum;
    const right = rightNum + 'px';
    const bottomNum = topNum + tHeightNum;
    const bottom = bottomNum + 'px';
  
    // lookList.value.push({
    //   styleW: `width: ${tWidth}; height: ${tHeight};`,
    //   styleCircle: `width: 16px; height: 16px; top: ${tHeightNum/2 - 8 + topNum}px; left: ${tWidthNum/2 - 8 + leftNum}px;`,
    //   styleL: `top: ${top}; left: ${left};`,
    //   img: getImagePortion(o, boxesArr)
    // })
    return { leftNum, left, topNum, top, tWidthNum, tWidth, tHeightNum, tHeight, rightNum, right, bottomNum, bottom, img:  getImagePortion(o, boxesArr)};
};