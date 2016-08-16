(function() {
    // var imageDatas = [];存储图片信息的数组
    for(var i=0; i<imgDatas.length; i++){
        imgDatas[i].imgUrl = 'imgs/' + imgDatas[i].fileName ;
    }

    /*
        创建图片组件
    */
    var ImgFigure = React.createClass({
        render : function(){
            return (
                <figure>
                    <img/>
                </figure>

            );
        }
    });

    // ReactDOM.render(
    //     <ImgFigure/>,
    //     document.getElementById('container')
    // );


    /*
        创建舞台组件
    */
    var Photowall = React.createClass({
        render: function(){
            return (
                <section className="stage">
                    <section className="img-sec">
                    </section>
                    <nav className="controller-nav">
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
