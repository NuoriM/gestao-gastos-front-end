<template>
  <div>
    <Drawer
      v-model:visible="visivel"
      header="Drawer"
      :dismissable="true"
      :pt="{
        root: {
          class: 'position-relative',
        },
        mask: {
          // class: 'bg-transparent dark:bg-transparent p-events-none',
          //   style: 'pointer-events: none;',
        },
      }"
    >
      <!-- class="!relative !w-[15rem] md:!w-[15rem] lg:!w-[15rem]" -->
      <template #container>
        <PanelMenu :model="panelMenuItems">
          <template #item="slotProps">
            <div class="p-menu-item-content">
              <a
                class="p-menu-item-link"
                style="padding: 0.7rem"
                :class="slotProps.item.customStyle ? 'flex-row-reverse' : 'flex-row'"
              >
                <i class="p-menu-item-icon" :class="slotProps.item.icon"></i>
                <small
                  class="p-menu-item-label"
                  :class="slotProps.item.customStyle ? 'flex-fill' : ''"
                  >{{ slotProps.item.label }}</small
                >
                <Avatar
                  v-if="slotProps.item.customStyle"
                  icon="pi pi-user"
                  class="mr-2"
                  size="normal"
                  shape="circle"
                />
              </a>
            </div>
          </template>
        </PanelMenu>
        <div class="position-absolute top-2" style="right: -45px">
          <Button
            icon="pi pi-arrow-left"
            @click="visivel = false"
            size="small"
            rounded
            severity="secondary"
          />
        </div>
        <div style="overflow-y: scroll" class="flex-fill">
          <Menu :model="menuItems">
            <template #item="slotProps">
              <div class="p-menu-item-content rounded-0">
                <a class="p-menu-item-link" style="padding: 0.7rem">
                  <i class="p-menu-item-icon" :class="slotProps.item.icon"></i>
                  <small class="p-menu-item-label">{{ slotProps.item.label }}</small>
                </a>
              </div>
            </template>
          </Menu>
        </div>
      </template>
    </Drawer>
    <!-- :class="['flex-1 transition-margin', visivel ? 'ml-60' : 'ml-0']" -->
    <div>
      <Toolbar :pt="{ root: { class: 'border-0 border-bottom rounded-0' } }">
        <template #start>
          <div class="d-flex align-items-center gap-3">
            <Button
              :icon="visivel ? 'pi pi-times' : 'pi pi-bars'"
              @click="visivel = !visivel"
              size="small"
            />
          </div>
        </template>

        <template #end>
          <div class="flex items-center gap-2">
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText placeholder="Buscar" size="small" />
            </IconField>
            <Button icon="pi pi-bell" text plain />
            <Button icon="pi pi-envelope" text plain />
          </div>
        </template>
      </Toolbar>
      <RouterView />
    </div>
  </div>
</template>
<script lang="ts">
import { useRouter } from 'vue-router'

export default {
  created() {
    const router = useRouter()
    const mainRoute = router.options.routes.filter(
      (route) => route.name === 'sistema' || route.name === 'informacoes-legais',
    )

    mainRoute.forEach((route) => {
      if (route.children) {
        this.menuItems.push({
          label: route.meta?.secao,
          items: route.children.map((child) => {
            let targetPath = child.path.startsWith('/') ? child.path : `/${child.path}`
            return {
              label: this.formatLabel(child.name),
              command: () => {
                this.$router.push(route.path + targetPath);
                this.visivel = false
              },
              icon: child.meta?.ico,
            }
          }),
        })
      } else {
        this.menuItems.push({
          label: this.formatLabel(route.meta?.secao),
        })
      }
    })
  },

  data() {
    return {
      visivel: false,
      menuItems: [
        // {
        // 	label: 'Painel',
        // 	items: [
        // 		{
        // 			label: 'Home',
        // 			icon: 'pi pi-home',
        // 			command: () => {
        // 				this.$router.push('/sistema/painel')
        // 			}
        // 		},
        // 		{
        // 			label: 'Configurações',
        // 			icon: 'pi pi-cog',
        // 			command: () => {
        // 				this.$router.push('/sistema/configuracoes')
        // 			}
        // 		}
        // 	]
        // },
        // {
        // 	label: 'Legal',
        // 	items: [
        // 		{
        // 			label: 'Termos de Uso',
        // 			icon: 'pi pi-file',
        // 			command: () => {
        // 				this.$router.push('/informacoes-legais/termos-de-uso')
        // 			}
        // 		},
        // 		{
        // 			label: 'Politica de Privacidade',
        // 			icon: 'pi pi-file',
        // 			command: () => {
        // 				this.$router.push('/informacoes-legais/politica-de-privacidade')
        // 			}
        // 		}
        // 	]
        // }
      ] as any,
      panelMenuItems: [
        {
          label: 'Amy Elsner',
          icon: 'pi pi-angle-down',
          customStyle: true,
          items: [
            {
              label: 'Configurações',
              icon: 'pi pi-cog',
              command: () => {
                this.$router.push('/sistema/perfil/configuracoes')
              },
            },
            {
              label: 'Perfil',
              icon: 'pi pi-user',
              command: () => {
                this.$router.push('/sistema/perfil')
              },
            },
            {
              label: 'Suporte',
              icon: 'pi pi-question-circle',
              command: () => {
                this.$router.push('/sistema/perfil/suporte')
              },
            },
            {
              label: 'Sair',
              icon: 'pi pi-sign-out',
              command: () => {
                sessionStorage.removeItem('token')
                window.location.reload()
              },
            },
          ],
        },
      ],
    }
  },
  methods: {
    formatLabel(name: any) {
      return name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ')
    },
  },
}
</script>
<style scoped>
/* .teste .p-overlay-mask-enter {
	animation: none !important;
} */

:deep(.p-panelmenu-submenu) {
  padding: 0;
}

:deep(.p-panelmenu-panel:last-child) {
  border-end-start-radius: 0px;
  border-end-end-radius: 0px;
}

:deep(.p-panelmenu-panel) {
  padding: 0;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  a {
    text-decoration: none;
  }
}

:deep(.p-menu) {
  border: none;
  padding: 0;

  .p-menu-list {
    padding: 0;
  }

  a {
    text-decoration: none;
  }
}

.transition-margin {
  transition: margin-left 0.3s ease;
}

.ml-60 {
  margin-left: 15rem;
}

:deep(.p-events-none) {
  pointer-events: none !important;
}
</style>
