<template>
<div class="page row">
  <div class="col-md-10">
    <InputSearch v-model="searchText" />
  </div>

  <div class="mt-3 col-md-6">
    <h4>
      Danh bạ
      <i class="fas fa-address-book"></i>
    </h4>

    <ContactList
      v-if="filteredContactsCount > 0"
      :contacts="filteredContacts"
      v-model:activeIndex="activeIndex"
    />

    <p v-else>Không có liên hệ nào.</p>

    <div class="mt-3 row justify-content-around align-items-center">
      <button
        class="btn btn-sm btn-primary"
        @click="refreshList()"
      >
        <i class="fas fa-redo"></i> Làm mới
      </button>

      <router-link
        :to="{ name: 'contact.add' }"
        class="btn btn-sm btn-success"
      >
        <i class="fas fa-plus"></i> Thêm mới
      </router-link>

      <button
        class="btn btn-sm btn-danger"
        @click="removeAllContacts"
      >
        <i class="fas fa-trash"></i> Xóa tất cả
      </button>
    </div>
  </div>

  <div class="mt-3 col-md-6" v-if="activeContact">
    <h4>
      Chi tiết Liên hệ
      <i class="fas fa-address-card"></i>
    </h4>

    <ContactCard :contact="activeContact" />
    <router-link
      :to="{ name: 'contact.edit', params: { id: activeContact._id } }"
      class="btn btn-warning"
    >
      <i class="fas fa-edit"></i> Hiệu chỉnh
    </router-link>
  </div>
</div>
</template>

<script>
import ContactCard from "@/components/ContactCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import ContactList from "@/components/ContactList.vue";
import ContactService from "@/services/contact.service";

export default {
components: {
  ContactCard,
  InputSearch,
  ContactList,
},

data() {
  return {
    contacts: [],
    activeIndex: -1,
    searchText: "",
  };
},

watch: {
  // Giám sát thay đổi của ô tìm kiếm
  searchText() {
    this.activeIndex = -1;
  },
},

computed: {
  // Chuyển contact thành chuỗi để tìm kiếm
  contactStrings() {
    return this.contacts.map((contact) => {
      const { name, email, address, phone } = contact;
      return [name, email, address, phone].join("");
    });
  },

  filteredContacts() {
    if (!this.searchText) return this.contacts;

    // Tách các từ trong searchText, loại bỏ khoảng trắng thừa
    const keywords = this.searchText.toLowerCase().split(/\s+/).filter(Boolean);
    return this.contacts.filter((_contact, index) => {
      const str = this.contactStrings[index].toLowerCase();
      // Chỉ cần liên hệ chứa bất kỳ từ nào trong searchText
      return keywords.some(word => str.includes(word));
    });
  },

  activeContact() {
    if (this.activeIndex < 0) return null;
    return this.filteredContacts[this.activeIndex];
  },

  filteredContactsCount() {
    return this.filteredContacts.length;
  },
},

methods: {
  async retrieveContacts() {
    try {
      this.contacts = await ContactService.getAll();
    } catch (error) {
      // Log chi tiết lỗi để kiểm tra
      if (error.response) {
        console.log('Lỗi lấy danh bạ:', error.response.status, error.response.data);
      } else {
        console.log(error);
      }
    }
  },

  refreshList() {
    this.retrieveContacts();
    this.activeIndex = -1;
  },

  async removeAllContacts() {
    if (confirm("Bạn muốn xóa tất cả Liên hệ?")) {
      try {
        await ContactService.deleteAll();
        this.refreshList();
      } catch (error) {
        console.log(error);
      }
    }
  },

  goToAddContact() {
    this.$router.push({ name: "contact.add" });
  },
},

mounted() {
  this.refreshList();
},
};
</script>

<style scoped>
.page {
  text-align: left;
  max-width: 750px;
}
</style>