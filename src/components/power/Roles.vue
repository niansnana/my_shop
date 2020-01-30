<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightId(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightId(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-right"></i>
                  </el-col>
                  <el-col class="[]" :span="18">
                    <!-- <el-tag v-for="(item3, i3) in item2" :key="item3.id" type="warning">{{item3.authName}}</el-tag> -->
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightId(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="ID" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="SetRightDialogVisible" width="50%" @close="setRightDialogClosed">
        <!-- 树形控件 -->
        <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <span slot="footer" class="diaglog-footer">
            <el-button @click="SetRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      SetRightDialogVisible: false,
    //   所有权限的数据
      rightslist: [],
    //   树形控件的绑定对象
      treeProps: {
          label: 'authName',
          children: 'children'
      },
    //   默认选中的节点
      defKeys: [],
      roleId: ''
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) return this.$message.error("请求失败");
      this.roleList = res.data;
      // console.log(this.roleList)
    },
    async removeRightId(role, rightId) {
      // 弹窗提示是否删除
      const confirmResult = await this.$confirm(
        "是否确认删除",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("取消成功");
      }
      // this.$message.success('删除成功')
      const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if(res.meta.status !== 200){
          return this.$message.error('删除失败')
      }
        this.$message.success('删除成功')
        // this.getRoleList();
        role.children = res.data;
    },
    async showSetRightDialog(role){
        this.roleId = role.id
        // 展示分配权限
        const {data: res} = await this.$http.get('rights/tree')
        if(res.meta.status !== 200){
            return this.$message.error('请求失败')
        }
        this.rightslist = res.data
        // console.log(this.rightslist)
        this.getLeafKeys(role, this.defKeys)
        this.SetRightDialogVisible = true
    },
    // 通过递归获取所有三级权限，并存储数组中
    getLeafKeys(node, arr){
        // 如果当前节点不包含children属性，则是三级节点
        if(!node.children){
            return arr.push(node.id)
        }
        node.children.forEach(item => 
            this.getLeafKeys(item, arr))
    },
    setRightDialogClosed(){
        this.defKeys = []
    },
    async allotRights(){
        // 为角色分配权限
        const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        // console.log(keys)
        const idStr = keys.join(',')
        const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
        if(res.meta.status !== 200){
            return this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
        this.getRoleList()
        this.SetRightDialogVisible = false
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>