<template>
  <div class="article-page">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>面经后台</el-breadcrumb-item>
      <el-breadcrumb-item>面经管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="never" border="false">
      <template #header>
        <div class="header">
          <span>共 {{ total }} 条记录</span>
          <el-button
            @click="open('add')"
            icon="el-icon-plus"
            size="small"
            type="primary"
            round
          >
            添加面经
          </el-button>
        </div>
      </template>
      <!--
        el-table 组件
          :data 用于指定表格的数据, 要求是一个数组
        el-table-column 组件
        row 行 column 列
        一个 column 组件就表示一列
          prop 该列对应的数据是哪一个, 指定属性名字符串即可
          label 表头标题
          width 宽度, 不设置表示自适应
       -->
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="stem" label="标题" width="400"></el-table-column>
        <el-table-column prop="creator" label="作者"></el-table-column>
        <el-table-column prop="likeCount" label="点赞数"></el-table-column>
        <el-table-column prop="views" label="浏览数"></el-table-column>
        <el-table-column
          prop="createdAt"
          label="更新时间"
          width="200"
        ></el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <div class="actions">
              <i class="el-icon-view" @click="open('preview', row.id)"></i>
              <i class="el-icon-edit-outline" @click="open('edit', row.id)" ></i>
              <i class="el-icon-delete" @click="del(row.id)"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--
        分页组件
        background: 是否带背景色
        layout="prev, pager, next" 分页组件的布局, 用逗号隔开, 千万别写错了!
        total: 数据的总数
        page-size: 每页显示的条数, 一般和发请求的数据保持一致
        current-page: 当前是第几页
        @current-change: 当前页发生改变时触发, 会传入最新的当前页
       -->
      <el-pagination
        background
        layout="prev, pager, next "
        :total="total"
        :page-size="pageSize"
        :current-page="current"
        @current-change="hChange"
      >
      </el-pagination>
    </el-card>
    <!-- visible 控制抽屉显示隐藏 -->
    <el-drawer size="50%" :title="title" :visible.sync="isOpen">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="标题" prop="stem">
          <el-input v-model="form.stem"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <quill-editor
            v-model="form.content"
            ref="myQuillEditor"
            @blur="$refs.form.validateField('content')"
          >
            <!-- 触发单个表单的校验 -->
          </quill-editor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">确认</el-button>
          <el-button @click="isOpen = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import {
  addArticles, delArticles, getArticles,
  getArticleDetail, updateArticle
} from '@/api/article'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  name: 'article-page',
  data () {
    return {
      id: null,
      current: 1,
      pageSize: 15,
      list: [],
      total: 0,
      isOpen: false,
      type: '',
      form: {
        stem: '',
        content: ''
      },
      rules: {
        stem: [{ required: true, message: '请输入标题', trigger: 'blur' }],

        content: [{ required: true, message: '请输入标题', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      const res = await getArticles({
        current: this.current,
        pageSize: this.pageSize
      })
      // console.log(res)
      // 存储分页数据
      this.list = res.data.rows
      // 存储总数
      this.total = res.data.total
    },
    hChange (val) {
      // console.log('当前页:', val)
      // 修改 current
      this.current = val
      // 重新发请求渲染数据即可
      this.getData()
    },
    async del (id) {
      try {
        const res = await delArticles(id)
        console.log(res)
        this.$message.success('删除成功')
        this.getData()
      } catch (error) {
        this.$message.warning(error.response.data)
      }
    },

    async open (type, id) {
      console.log(type, id)
      // 打开抽屉
      this.isOpen = true
      // 设置类型
      this.id = id
      this.type = type
      if (type !== 'add') {
        const res = await getArticleDetail(id)
        this.form = { ...res.data }
      }
    },
    async submit () {
      try {
        // 1.表单校验
        await this.$refs.form.validate()
        if (this.type === 'add') {
          // 2.发送请求
          await addArticles(this.form)
          // 3.提示用户
          this.$message.success('添加成功')
        }
        if (this.type === 'edit') {
          // 2.发送请求
          const { id, stem, content } = this.form
          await updateArticle({ id, stem, content })
          // 3.提示用户
          this.$message.success('修改成功')
        }

        // 4.关闭抽屉
        this.isOpen = false
        // 5.清除表单
        this.$refs.form.resetFields()
        // 6.更新数据
        this.getData()
      } catch (error) {
        this.$message.warning(error.response.data)
      }
    }
  },
  computed: {
    title () {
      // 自己想想如何优化?
      switch (this.type) {
        case 'add':
          return '添加面经'
        case 'preview':
          return '预览面经'
        default:
          return '修改面经'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 25px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 16px;
  }
  .actions {
    font-size: 18px;
    display: flex;
    justify-content: space-around;
    color: #666;
    > i:hover {
      color: rgba(114, 124, 245, 1);
      cursor: pointer;
    }
  }
}
.el-pagination {
  margin-top: 20px;
  text-align: center;
}
.el-breadcrumb {
  margin-top: 10px;
}
.el-form {
  padding-right: 40px;
}
.quill-editor {
  ::v-deep .ql-editor {
    height: 300px;
  }
}
.el-rate {
  padding: 10px 0;
}
.article-preview {
  padding: 0 40px 40px 40px;
  > h5 {
    font-size: 20px;
    color: #666;
    border-bottom: 1px dashed #ccc;
    padding-bottom: 30px;
    margin: 0 0 20px 0;
  }
}
</style>
