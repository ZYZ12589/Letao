$(function () {
    /*
    * 由于整个页面都在进行本地历史记录的操作, 所以约定键名: search_list
    *
      以下 3 行代码, 用于在控制台执行, 添加假数据
      var arr = ["耐克", "啊迪", "阿迪王", "耐克王", "老奶奶", "老北京"];
      var jsonStr = JSON.stringify( arr );
      localStorage.setItem( "search_list", jsonStr );
    * */


    /*
    * 功能分析
    * 功能1: 本地历史记录渲染展示
    * 功能2: 清空所有历史记录
    * 功能3: 删除单条历史记录
    * 功能4: 添加搜索历史
    * */

    // 获取本地存储数组，封装成函数
    function getArr() {
        // 获取本地存储
        var jsonStr = localStorage.getItem("search_list");
        // console.log(jsonStr);

        // 转换数据格式
        var arr = JSON.parse(jsonStr);
        // console.log(arr);

        return arr;
    }

    // 1-根据本地存储，渲染本地历史记录
    function render() {
        var arr = getArr() || [];

        var htmlStr = template('history_tmp', { list: arr });
        $('.search_history').html(htmlStr);
    }

    render();


    // 2-清空所有历史记录
    // 思路：通过事件委托，清空数组，清空历史记录
    $('.search_history').on('click', '.empty_btn', function () {
        // 获取本地存储数组
        var arr = getArr();

        // 清空数组
        arr = [];

        // 转换数据格式
        var jsonStr = JSON.stringify(arr);

        // 保存到本地存储
        localStorage.setItem('search_list', jsonStr);

        // 重新渲染页面
        render();
    })


    // 3-删除单条历史记录
    $('.search_history').on('click', '.delete_btn', function () {
        // 获取数据 下标 
        var index = $(this).data('index');

        // 获取本地存储数组
        var arr = getArr();

        // 删除数组指定项
        arr.splice(index, 1);

        // 转换数据格式
        var jsonStr = JSON.stringify(arr);

        // 保存到本地存储
        localStorage.setItem('search_list', jsonStr);

        // 重新渲染页面
        render();



    })

    // 4-添加搜索历史
    // 思路：点击搜索按钮，获取 input 的 value 值，保存到数组中，重新渲染页面
    // 1-去除两边空格   2-验证提交是否为空
    $('.search_btn').on('click', function () {
        // 获取 input 的值
        var value = $('.search_input').val().trim();

        // 判断是否为空
        if (!value) {
            mui.toast('请输入搜索内容');
            return;
        }

        // 获取本地存储数组
        var arr = getArr();

        // 将 value 添加到最前面
        arr.unshift(value);

        // 转换数据格式
        var jsonStr = JSON.stringify(arr);

        // 保存到本地存储
        localStorage.setItem('search_list', jsonStr);

        // 重新渲染页面
        render();

        // 重置input 
        $('.search_input').val('');

        // 跳转到商品列表页面
        location.href = 'product_list.html'
    })





})