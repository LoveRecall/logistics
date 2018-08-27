<template>
    <div class="Details">
        <div class="head">
            <div class="title">
                Workbenchware（SKU name)
                <Button class="btn" type="primary" shape="circle">Add to Bookmark</Button>
            </div>

            <div class="detail">
                <Row>
                    <Col span="6" class="left">
                        <Carousel autoplay :autoplay-speed="2500" arrow="always" v-model="value1" loop>
                            <CarouselItem>
                                <div class="carousel-img">
                                    <img src="../../assets/images/login-back.jpg" alt="">
                                </div>
                            </CarouselItem>
                            <CarouselItem>
                                <div class="carousel-img">
                                    <img src="../../assets/images/login-back.jpg" alt="">
                                </div>
                            </CarouselItem>
                            <CarouselItem>
                                <div class="carousel-img">
                                    <img src="../../assets/images/login-back.jpg" alt="">
                                </div>
                            </CarouselItem>
                            <CarouselItem>
                                <div class="carousel-img">
                                    <img src="../../assets/images/login-back.jpg" alt="">
                                </div>
                            </CarouselItem>
                        </Carousel>
                    </Col>
                    <Col span="18" class="right">
                        <Row>
                            <Col class="list" :xs="24" :sm="12" :md="8" :lg="8">
                                工厂货号：xxxx
                            </Col>
                            <Col class="list" :xs="24" :sm="12" :md="8" :lg="8">
                                工厂货号：xxxx
                            </Col>
                            <Col class="list" :xs="24" :sm="12" :md="8" :lg="8">
                                工厂货号：xxxx
                            </Col>
                            <Col class="list" :xs="24" :sm="12" :md="8" :lg="8">
                                工厂货号：xxxx
                            </Col>
                            <Col class="list" :xs="24" :sm="12" :md="8" :lg="8">
                                工厂货号：xxxx
                            </Col>
                            <Col class="list" :xs="24" :sm="12" :md="8" :lg="8">
                                工厂货号：xxxx
                            </Col>
                            <Col class="list" :xs="24" :sm="12" :md="8" :lg="8">
                                工厂货号：xxxx
                            </Col>
                            <Col class="list" :xs="24" :sm="12" :md="8" :lg="8">
                                工厂货号：xxxx
                            </Col>

                        </Row>
                    </Col>
                </Row>
                <div class="btns">
                    <Button type="primary">Create Inquiry</Button>
                    <Button type="primary">Create Order</Button>
                    <Button type="primary">Add to Compare</Button>
                    <Button type="primary" shape="circle">Add to Bookmark</Button>
                </div>
            </div>
        </div>
        <div class="body">
            <Tabs value="name1">
                <TabPane label="Basic Info" name="name1">标签一的内容</TabPane>
                <TabPane label="Customer Info" name="name2">标签二的内容</TabPane>
                <TabPane label="Price Info" name="name3">标签三的内容</TabPane>
                <TabPane label="PackingInfo" name="name4">标签一的内容</TabPane>
                <TabPane label="Logistic" name="name5">标签二的内容</TabPane>
                <TabPane label="Other Info" name="name6">标签三的内容</TabPane>
            </Tabs>
        </div>
    </div>
</template>

<script>
    export default {
        name: "detail",
        data(){
            return{
                value1: 0
            }
        },
        methods:{

        }
    }
</script>

<style scoped>
    .Details{
        background-color: #f4f4f4;
    }
    .Details .head{
        background-color: #FFFFFF;
        padding:0 20px;

    }
    .Details .head .title{
        position: relative;
        height: 40px;
        line-height: 40px;
        font-weight: bold;
        font-size: 18px;
    }

    .Details .head .title .btn{
        position: absolute;
        right: 10px;
        top:4px;
    }
    .Details .head .detail{
        margin-top: 8px;
    }
    .Details .head .detail .carousel-img{
        height: 170px;
    }
    .Details .head .detail .carousel-img img{
        width: 100%;
        height: 100%;
    }
    .Details .head .detail .right{
        padding-top: 10px;
    }
    .Details .head .detail .list{
        padding-left: 30px;
        font-size: 14px;
        line-height: 2.5;
        border-bottom: 1px dotted #e0e0e0;
    }
    .Details .head .detail .btns{
        text-align: center;
        padding: 15px 0;
    }
    .Details .head .detail .btns>Button{
        margin-right: 10px;
    }

    .Details .body{
        margin-top: 10px;
        background-color: #FFFFFF;
    }
</style>