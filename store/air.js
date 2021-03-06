export const state = ()=>{
    return{
        //历史查询
        searchList:[],
        //选中的机票的详细信息
        flightData:{
            seat_infos: {}
        },
        //一个订单中有多少乘机人
        FlightUsersLength:0,
        //总价格
        allPrice:0
    }
}

//同步修改state的数据
export const mutations = {
    //存储历史查询的数据
    setSearchList(state,data){
        //把新查询的数据追加到第一个
        state.searchList.unshift(data);
        //如果历史记录的长度大于5
        if(state.searchList.length>5){
            //只保留数组的前五位
            state.searchList.length=5;
        }
    },

    //总价格
    setAllPrice(state,data){
        state.allPrice = data;
    },

    //乘机人数
    setFlightUsersLength(state,data){
        state.FlightUsersLength = data;
    },

    //存储选中的机票的详细信息
    setflightData(state,data){
        state.flightData = data;
    }




}



