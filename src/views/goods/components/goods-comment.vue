<template>
  <div class="goods-comment">
    <!-- 商品评价头部 -->
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p><span>{{commentInfo.salesCount}}</span><span>人购买</span></p>
        <p><span>{{commentInfo.praisePercent}}</span><span>好评率</span></p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            href="javascript:;"
            v-for="(item, index) in commentInfo.tags"
            :key="item.title"
            :class="{active: currentTagIndex === index}"
            @click="changeTag(index)"
          >{{item.title}}（{{item.tagCount}}）</a>
        </div>
      </div>
    </div>
    <div class="sort" v-if="commentInfo">
      <span>排序：</span>
      <a
        href="javascript:;"
        :class="{active: reqParams.sortField === null}"
        @click="changeSort(null)"
      >默认</a>
      <a
        href="javascript:;"
        :class="{active: reqParams.sortField === 'createTime'}"
        @click="changeSort('createTime')"
      >最新</a>
      <a
        href="javascript:;"
        :class="{active: reqParams.sortField === 'praiseCount'}"
        @click="changeSort('praiseCount')"
      >最热</a>
    </div>
    <!-- 评价列表 -->
    <div class="list" v-if="commentList">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="">
          <span>{{formatNickname(item.member.nickname)}}</span>
        </div>
        <div class="body">
          <div class="score">
            <i class="iconfont icon-wjx01" v-for="i in item.score" :key="i + 's'"></i>
            <i class="iconfont icon-wjx02" v-for="i in (5 - item.score)" :key="i + 'k'"></i>
            <span class="attr">
              {{formatSpecs(item.orderInfo.specs)}}
            </span>
          </div>
          <div class="text">{{item.content}}</div>
          <!-- 图片预览组件 -->
          <GoodsCommentImage v-if="item.pictures.length" :pictures="item.pictures" />
          <div class="time">
            <span>{{item.createTime}}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{item.praiseCount}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页器 -->
    <xtx-pagination
      :total="total"
      :currentPage="reqParams.page"
      :pageSize="reqParams.pageSize"
      v-if="total"
      @currentChange="changeCurrentPage"
    />
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import GoodsCommentImage from './goods-comment-image.vue'
import { findGoodsCommentInfo, findGoodsCommentList } from '../../../api/product'
export default {
  name: 'GoodsComment',
  components: {
    GoodsCommentImage
  },
  setup () {
    const route = useRoute()
    const commentInfo = ref(null)
    // 获取详情信息
    findGoodsCommentInfo({ id: route.params.id }).then(res => {
      const data = res.result
      data.tags.unshift({ title: '有图', tagCount: data.hasPictureCount, type: 'img' })
      data.tags.unshift({ title: '全部评价', tagCount: data.evaluateCount, type: 'all' })
      commentInfo.value = data
    })

    // 激活tag
    const currentTagIndex = ref(0)
    const changeTag = (index) => {
      currentTagIndex.value = index
      // 修改筛选条件
      // 情况一：点击全部评价
      // 情况二：点击有图
      // 情况三：点击tag
      const tag = commentInfo.value.tags[index]
      if (tag.type === 'all') {
        reqParams.hasPicture = null
        reqParams.tag = null
      } else if (tag.type === 'img') {
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        reqParams.hasPicture = null
        reqParams.tag = tag.title
      }
      // 页面重置为1
      reqParams.page = 1
    }

    // 更改排序
    const changeSort = (value) => {
      reqParams.sortField = value
      // 页面重置为1
      reqParams.page = 1
    }

    // 定义转化数据的函数
    const formatSpecs = (specs) => {
      return specs.map(item => `${item.name}: ${item.nameValue}`).join(' ')
    }
    const formatNickname = (nickname) => {
      // 字符串的substr方法，传入负数，就是从字符串的后面截取一个字符下来
      return nickname.substr(0, 1) + '****' + nickname.substr(-1)
    }

    // 获取商品列表数据
    // 注意：一个请求，如果参数值为null的话，是不会将这个参数传递给后台的
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      // 最热(praiseCount)、最新(createTime)
      sortField: null
    })

    // 监听reqParams变化，发送请求(初始化也要发送请求)
    const commentList = ref([])
    const total = ref(0)
    watch(reqParams, () => {
      findGoodsCommentList(route.params.id, reqParams).then(res => {
        commentList.value = res.result.items
        total.value = res.result.counts
      })
    }, { immediate: true })

    // 分页器页码发生变化
    const changeCurrentPage = (newPage) => {
      reqParams.page = newPage
    }

    return {
      commentInfo,
      currentTagIndex,
      reqParams,
      commentList,
      total,
      formatSpecs,
      formatNickname,
      changeTag,
      changeSort,
      changeCurrentPage
    }
  }
}
</script>

<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor,50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active, &:hover {
        color: @xtxColor;
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
