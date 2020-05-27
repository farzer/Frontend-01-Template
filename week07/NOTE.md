## Flex Layout

### flex 基本概念

- 容器：使用 flex 布局的元素都是所谓的 flex 容器
- 项目：容器内部的所有元素都会自动默认为容器成员，也就是所谓的项目（flex item）
- 轴：容器存在两个抽象的轴，决定项目的排列方向，有主轴（main axis）和交叉轴（cross axis）
- 开始位置以及结束位置：每个轴都存在开始位置和结束位置，项目按照开始到结束顺序排列
  - 主轴上的开始位置叫做 main start，结束位置叫做 main end
  - 交叉轴的开始位置叫做 cross start，结束位置叫做 cross end
- 轴空间：是指项目占据的空间，项目的主轴空间叫做 main size，交叉轴空间叫做 cross size

具体概念映射到图标如下：

|------------------------------------------------------------------|
|  flex container                              ↑             ↑     |
|                                              |        cross start|
|                                        交叉轴 cross axis          |
|                                              |                   |
|←----- 主轴 main axis --------------------------------------------→|
|← main start                                  |          main end →|
|   |-----------------|   |-----------------|  |                    |
|   | flex item       |   | flex item ↑     |  |                    |
|   |                 |   |           |     |  |                    |
|   |                 |   |      cross size |  |                    |
|   |←---main size---→|   |           |     |  |                    |
|   |                 |   |           ↓     |  |                    |
|   |-----------------|   |-----------------|  |                    |
|                                              |         cross end  |
|                                              ↓              ↓     |
|-------------------------------------------------------------------|

### flex 容器可以设置的样式属性

可以设置 `flex-direction`, `flex-wrap`, `flex-flow`, `justify-content`, `align-items`, `align-content`

+ flex-direction: 设置主轴的方向，也是项目的排列顺序
  - row（默认）: main axis 为水平方向，main start在左端
  - row-reverse: main axis为水平方向，main end在左端
  - column: main axis 为垂直方向，起点在上沿
  - column-reverse: main axis 为垂直方向，起点在下方
+ flex-wrap: 如果项目超出主轴，是否换行排列
  - nowrap（默认）: 不换行
  - wrap: 换行
  - wrap-reverse: 换行，反转行数
+ flex-flow: flex-direction 和 flex-wrap 的简写，格式为 `flex-flow: <flex-direction> <fle-wrap>`，默认为 `row nowrap`
+ justify-content: 定义容器内项目在主轴上的对齐方式
  - flex-start（默认）：左对齐
  - flex-end：右对齐
  - center：居中对齐
  - space-between：两端对齐，项目间隔一致，轴两侧无留空
  - space-around：两端对齐，项目间隔一致，轴两侧间隙是项目间隔的一半
+ align-items: 定义容器内项目在交叉轴上的对齐方式
  - flex-start：交叉轴的起点对齐
  - flex-end：交叉轴的终点对齐
  - center：交叉轴中点对齐
  - baseline: 项目的第一行文字的基线对齐。
  - stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。
+ align-content：定义了多行的对齐方式。如果项目只有一行，该属性不起作用。
  - flex-start：与交叉轴的起点对齐。
  - flex-end：与交叉轴的终点对齐。
  - center：与交叉轴的中点对齐。
  - space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。
  - space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
  - stretch（默认值）：轴线占满整个交叉轴。

### flex 项目可以设置的样式属性

flex item可以设置的属性有：`order`, `flex-grow`, `flex-shrink`, `flex-basis`, `flex`, `align-self`

+ order（默认0）: 定义项目的排列顺序。数值越小，排列越靠前，默认为0。
+ flex-grow（默认0）: 定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。如果所有项目的flex-grow属性都为1，则它们将等分剩余空间（如果有的话）；如果一个项目的flex-grow属性为2，其他项目都为1，则前者占据的剩余空间将比其他项多一倍。
+ flex-shrink（默认1）：定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小；如果一个项目的flex-shrink属性为0，则空间不足时，项目不缩小。
+ flex-basis（默认 auto）：定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。如果设为跟width或height属性一样的值，则项目将占据固定空间。
+ flex（默认 0 1 auto）：是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。格式为 `<flex-grow> <flex-shrink> <flex-basis>`
+ align-self（默认auto）：允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。其他值同 align-items

### 布局思路

#### 第一步 预处理元素的 flex 计算默认样式

#### 第二步 收集元素进行（hang）

1. 分行
  - 根据主轴尺寸（mainSize），把元素分进行
  - 若设置 no-wrap，则强行分配进第一行
