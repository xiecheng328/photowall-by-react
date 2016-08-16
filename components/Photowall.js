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
        创建图片组件
    */
    var ImgFigure = React.createClass({


        render : function(){
            var styleObj = {};
            //如果props属性中制定了这张图片的位置，则使用
            if(this.props.arrage.pos){
                styleObj = this.props.arrage.pos;

            }
            return (
                <figure className="img-figure" style={styleObj}>
                    <img src={this.props.data.imgUrl} alt={this.props.data.title}/>
                    <figcaption >
                        <h2 className="img-title">{this.props.data.title}</h2>
                     </figcaption>
                </figure>

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

                //居中centerIndex的图片
                imgsArrangeCenterArr[0].pos = centerPos;

                //取出要布局上侧的图片的状态信息
                topImgSplicIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
                imgsArrangeTopArr = imgsArrangeArr.splice(topImgSplicIndex, topImgNum);

                //布局位于上侧的图片
                imgsArrangeTopArr.forEach(function(value, index){
                    imgsArrangeTopArr[index].pos = {
                        top : getRangeRandom(vPosRangeTopY[0], vPosRangeTopY),
                        left : getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                    };

                });

                //布局左右两侧的图片
                for(var i=0, j=imgsArrangeArr.length, k=j/2; i<j; i++){
                    var hPosRangeLORX = null;

                    //前半部分布局左边，右半部分布局右边
                    if(i < k){
                        hPosRangeLORX = hPosRangeLeftSecX;
                    }else{
                        hPosRangeLORX = hPosRangeRightSecX;
                    }
                    imgsArrangeArr[i].pos = {
                        top : getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                        left : getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
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
        getInitialState : function(){
            return {
                imgsArrangeArr : [
/*                    {
                        pos : {
                            left : '0',
                            top : '0'
                        }
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
            this.Constant.vPosRange.topY[0] = -halfImgH;
            this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
            this.Constant.vPosRange.x[0] = halfStageW - imgW;
            this.Constant.vPosRange.x[1] = halfStageW;

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
                        }
                    }
                }
                imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure' + index} arrage={this.state.imgsArrangeArr[index]}/>);
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
