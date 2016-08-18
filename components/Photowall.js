(function() {
    for(var i=0; i<imgDatas.length; i++){
        imgDatas[i].imgUrl = 'imgs/' + imgDatas[i].fileName ;
    }
    /*
        获取区间内的随机值
    */
    function getRangeRandom(low, high){
        return Math.floor(Math.random() * (high - low) + low);
    }

    /*
        获取0-30°之间的一个任意正负值
    */
    function get30DegRandom(){
        return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
    }

    /*
        创建图片组件
    */
    var ImgFigure = React.createClass({
        handleClick : function(e){
            if(this.props.arrange.isCenter){
                this.props.inverse();
            }else{
                this.props.center();
            }
            e.stopPropagation();
            e.preventDefault();
        },

        render : function(){
            var styleObj = {};
            //如果props属性中制定了这张图片的位置，则使用
            if(this.props.arrange.pos){
                styleObj = this.props.arrange.pos;
            }
 
            //如果图片的旋转角度有值并且不为0， 添加旋转角度
            if(this.props.arrange.rotate){
                (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
                    styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
                  }.bind(this));
            }

            var imgFigureClassName = 'img-figure';
            imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

            if(this.props.arrange.isCenter){
                styleObj.zIndex = 11;
            }

            return (
                <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                    <img src={this.props.data.imgUrl} alt={this.props.data.title}/>
                    <figcaption >
                        <h2 className="img-title">{this.props.data.title}</h2>
                        <div className="img-back" onClick={this.handleClick}>
                            <p>
                                {this.props.data.desc}
                            </p>
                        </div>
                     </figcaption>
                </figure>
            );
        }
    });

    /*
        创建控制组件
    */
    var ControllerUnit = React.createClass({
        handleClick : function(e){
            //如果点击是当前选中的按钮，则翻转图片，否则将对应的图片居中
            if(this.props.arrange.isCenter){
                this.props.inverse();
            }else{
                this.props.center();
            }

            e.stopPropagation();
            e.preventDefault();
        },
        render : function(){
            var controllerUnitClassName = 'controller-unit';

            if(this.props.arrange.isCenter){
                controllerUnitClassName += ' is-center';
                if(this.props.arrange.isInverse){
                    controllerUnitClassName += ' is-inverse';
                }
            }
            return (
                <span className={controllerUnitClassName} onClick={this.handleClick} />

            );
        }
    });

    /*
        创建舞台组件
    */
    var Photowall = React.createClass({
        Constant : {//存储图片初始位置
            centerPos : {
                left : 0,
                right : 0
            },
            hPosRange : {//水平方向的取值范围
                leftSecX : [0, 0],
                rightSecX : [0, 0],
                y : [0, 0]
            },
            vPosRange : {//垂直方向的取值范围
                x : [0, 0],
                topY : [0, 0]
            }
        },

        /*
            翻转图片,返回闭包函数
        */
        inverse : function(index){
            return function(){
                var imgsArrangeArr = this.state.imgsArrangeArr;
                imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
                this.setState({
                    imgsArrangeArr : imgsArrangeArr
                });
            }.bind(this);
        },


        //  重新布局所有图片，指定居中哪个图片
        rearange : function(centerIndex){
            var imgsArrangeArr = this.state.imgsArrangeArr,
                Constant = this.Constant,
                centerPos = Constant.centerPos,
                hPosRange = Constant.hPosRange,
                vPosRange = Constant.vPosRange,
                hPosRangeLeftSecX = hPosRange.leftSecX,
                hPosRangeRightSecX = hPosRange.rightSecX,
                hPosRangeY = hPosRange.y,
                vPosRangeTopY = vPosRange.topY,
                vPosRangeX = vPosRange.x,

                imgsArrangeTopArr = [],
                topImgNum = Math.floor(Math.random() * 2),//上侧显示0到1个
                topImgSplicIndex = 0,//标记上侧的图片是从数组中哪个索引拿出来的

                imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

                //居中centerIndex的图片, 居中图片不需要旋转
                imgsArrangeCenterArr[0] = {
                    pos : centerPos,
                    rotate : 0,
                    isCenter : true
                };

               /* //取出要布局上侧的图片的状态信息
                topImgSplicIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
                imgsArrangeTopArr = imgsArrangeArr.splice(topImgSplicIndex, topImgNum);

                //布局位于上侧的图片
                imgsArrangeTopArr.forEach(function(value, index){
                    imgsArrangeTopArr[index] = {
                        pos : {
                            top : getRangeRandom(vPosRangeTopY[0], vPosRangeTopY),
                            left : getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                        },
                        rotate : get30DegRandom(),
                        isCenter : false
                    };

                });*/

                //布局左右两侧的图片
                for(var i=0, j=imgsArrangeArr.length, k=j/2; i<j; i++){
                    var hPosRangeLORX = null;

                    //前半部分布局左边，右半部分布局右边
                    if(i < k){
                        hPosRangeLORX = hPosRangeLeftSecX;
                    }else{
                        hPosRangeLORX = hPosRangeRightSecX;
                    }
                    imgsArrangeArr[i] = {
                        pos : {
                            top : getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                            left : getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                        },
                        rotate : get30DegRandom(),
                        isCenter : false
                    }
                }

                //把之前的元素再填充回去
                if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
                    imgsArrangeArr.splice(topImgSplicIndex, 0, imgsArrangeTopArr[0]);
                }

                imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

                this.setState({
                    imgsArrangeArr : imgsArrangeArr
                });
        },
        /*
            居中对应的图片
        */
        center : function(index){
            return function(){
                this.rearange(index);
            }.bind(this);
        },
        getInitialState : function(){
            return {
                imgsArrangeArr : [
/*                    {
                        pos : {
                            left : '0',
                            top : '0'
                        },
                        rotate : 0,
                        isInverse : false,
                        isCenter : false

                    }*/

                ]
            };
        },

        // 组件加载以后，为每张图片计算其位置的范围
        componentDidMount : function(){
            //拿到舞台大小
            var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
                stageW = stageDOM.scrollWidth,
                stageH = stageDOM.scrollHeight,
                halfStageW = Math.ceil(stageW / 2),
                halfStageH = Math.ceil(stageH / 2);
            //拿到imgFigure的大小
            var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
                imgW = imgFigureDOM.scrollWidth,
                imgH = imgFigureDOM.scrollHeight,
                halfImgW = Math.ceil(imgW / 2),
                halfImgH = Math.ceil(imgH / 2);

            //计算中心图片的位置点
            this.Constant.centerPos = {
                left : halfStageW - halfImgW,
                top : halfStageH - halfImgH
            };
            //计算左侧、右侧区域图片排布位置的取值范围
            this.Constant.hPosRange.leftSecX[0] = -halfImgW;
            this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
            this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
            this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
            this.Constant.hPosRange.y[0] = - halfImgH;
            this.Constant.hPosRange.y[1] = stageH - halfImgH;

            //计算上侧区域图片排布位置的取值范围
            // this.Constant.vPosRange.topY[0] = -halfImgH;
            // this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
            // this.Constant.vPosRange.x[0] = halfStageW - imgW;
            // this.Constant.vPosRange.x[1] = halfStageW;

            this.rearange(0);
        },

        render: function(){
            var controllerUnits = [],
                imgFigures = [];
            imgDatas.forEach(function(value, index){
                if(!this.state.imgsArrangeArr[index]){
                    this.state.imgsArrangeArr[index] = {
                        pos : {
                            left : 0,
                            top : 0
                        },
                        rotate : 0,
                        isInverse : false,
                        isCenter : false
                    }
                }
                imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure' + index} 
                    arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} 
                    center={this.center(index)}/>);

                controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} 
                    center={this.center(index)}/>);
            }.bind(this));

            return (
                <section className="stage" ref="stage">
                    <section className="img-sec">
                        {imgFigures}
                    </section>
                    <nav className="controller-nav">
                        {controllerUnits}
                    </nav>
                </section>
            );
        }
    });

    ReactDOM.render(
        <Photowall />,
        document.getElementById('container')
    );

})();
