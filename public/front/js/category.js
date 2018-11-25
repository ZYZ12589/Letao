// 通过 ajax 请求，获取一级菜单数据，渲染到页面
$(function () {

    // 加载 ajax 请求
    renderTop();

    // 封装一级分类 ajax 请求
    function renderTop() {
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategory',
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                // 通过 模板引擎，渲染页面
                $(".category_left_box").html(template("category_left_tmp", info));

                // 渲染二级分类
                renderSecond(info.rows[0].id);
            }
        })
    }


    // 封装二级分类 ajax 请求
    function renderSecond(id) {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategory',
            data: {
                id: id
            },
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                $(".category_right_box").html(template("category_right_tmp", info));
            }
        })
    }

    // 为一级分类添加点击事件，获取自身的 id，通过 id 获取二级分类，渲染页面
    $(".category_left_box").on('click', 'a', function () {

        // 给自己添加 current 类名，让父级的兄弟元素的子元素移除 current 类名
        $(this).addClass("current").parent().siblings().children().removeClass("current");

        // 获取 id 
        var id = $(this).data("id");

        // 根据 id 获取二级分类数据，渲染数据
        renderSecond(id);
    })
})