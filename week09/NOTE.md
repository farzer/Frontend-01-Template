# css 动画

## @keyframes 与 animation

```css
@keyframes mykf {
  from {
    background: red;
  }

  to {
    background: cyan;
  }
}
div {
  animation: mykf 5s infinate;
}
```

帧：帧可以简单理解为一个画面。帧率是每秒画面的更新次数

- 帧率能够达到 50 ～ 60 FPS 的动画将会相当流畅，让人倍感舒适；
- 帧率在 30 ～ 50 FPS 之间的动画，因各人敏感程度不同，舒适度因人而异；
- 帧率在 30 FPS 以下的动画，让人感觉到明显的卡顿和不适感；
- 帧率波动很大的动画，亦会使人感觉到卡顿。

所以一般来说，每一帧的时间在 1000/60 = 16.7ms 符合我们对动画顺畅的期望

## animation

animation 是如下css属性的合并：

- animation-name 时间曲线
- animation-duration 动画的时长
- animation-timing-function 动画的时间曲线
- animation-delay 动画开始前的延时
- animation-iteration-count 动画的播放次数
- animation-direction 动画的方向

## transition

transition 也是多个 css 属性的合并：

- transition-property: 要变换的属性
- transition-duration: 变换时长
- transition-timing-function: 时间曲线
- transition-delay: 延迟

## cubic-bezier

> 贝塞尔曲线

贝塞尔曲线根据控制点的数量分为：
- 一阶贝塞尔曲线（2 个控制点）
- 二阶贝塞尔曲线（3 个控制点）
- 三阶贝塞尔曲线（4 个控制点）
- n阶贝塞尔曲线（n+1个控制点）

# CSS 颜色

实质是光

RGB色彩模式：是工业界的一种颜色标准，是通过对红、绿、蓝三个颜色通道的变化以及它们相互之间的叠加来得到各式各样的颜色

CMYK颜色模式：当阳光照射到一个物体上时，这个物体将吸收一部分光线,并将剩下的光线进行反射，反射的光线就是 们所看见的物体颜色

HSB 为 色相，饱和度，明度，
HSL 为 色相，饱和度，亮度