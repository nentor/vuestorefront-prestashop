<template>
  <ValidationObserver v-slot="{ handleSubmit, reset }">
    <form
      class="form"
      @submit.prevent="handleSubmit(submitForm(reset))"
    >
      <div class="form__horizontal">
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:2|nothavenumber"
          class="form__element"
        >
          <SfInput
            v-model="form.firstName"
            name="firstName"
            label="First Name"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:2|nothavenumber"
          class="form__element"
        >
          <SfInput
            v-model="form.lastName"
            name="lastName"
            label="Last Name"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
      </div>
      <div class="form__horizontal">
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|email"
          class="form__element"
        >
          <SfInput
            v-model="form.email"
            type="email"
            name="email"
            label="Your e-mail"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>

      </div>
      <div class="form__horizontal">
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:2"
          class="form__element"
        >
        <SfInput
          v-model="currentPassword"
          type="password"
          name="currentPassword"
          label="Current Password"
          required
          class="form__element"
        />
        </ValidationProvider>
      </div>
      <SfButton
        class="form__button"
      >
        {{ $t('Submit') }}
      </SfButton>
    </form>
  </ValidationObserver>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import {
  SfInput,
  SfButton,
  SfModal,
  SfSelect,
  SfProductOption
} from '@storefront-ui/vue';
import { useUiNotification } from '~/composables';
export default defineComponent({
  name: 'CreateAccountForm',
  components: {
    SfInput,
    SfButton,
    SfModal,
    SfSelect,
    SfProductOption,
    ValidationProvider,
    ValidationObserver
  },
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['submit'],
  setup(props, context) {
    const emit = context.emit;
    const { $router } = context.root;
    const currentPassword = ref('');
    const genderOptions = [
      { value: 1, label: 'male' },
      { value: 2, label: 'female' }
    ];
    const resetForm = () => ({
      firstName: '',
      lastName: '',
      email: '',
      gender: ''
    });
    const {
      send: sendNotification
    } = useUiNotification();
    const form = ref(resetForm());
    const submitForm = (resetValidationFn) => () => {
      const onComplete = () => {
        form.value = resetForm();
        currentPassword.value = '';
        $router.push(context.root.localePath({ name: 'shipping' }));
        resetValidationFn();
      };
      const onError = () => {
        sendNotification({
          id: Symbol('user_update_failed'),
          message: 'Could not update user! Check password or lastname, firstname format.',
          type: 'danger',
          icon: 'error',
          persist: false,
          title: 'User Account Update'
        });
      };
      if (currentPassword.value) {
        form.value.password = currentPassword.value;
      }
      emit('submit', { form, onComplete, onError });
    };
    return {
      currentPassword,
      form,
      submitForm,
      genderOptions
    };
  }
});
</script>
<style lang='scss' scoped>
.form {
  &__element {
    display: block;
    margin: 0 0 var(--spacer-lg) 0;
  }
  &__button {
    display: block;
    width: 100%;
    @include for-desktop {
      width: 17.5rem;
    }
  }
  &__horizontal {
    @include for-desktop {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .form__element {
      @include for-desktop {
        flex: 1;
        margin-right: var(--spacer-2xl);
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
