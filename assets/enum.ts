import { validation as v } from './validation'
import type { InputType, InputComponentsType, SnackbarType, SnackbarTypeList } from '~/assets/type'
export const Regexp = {
  normalize: /\/$/,
  public: /(^\/(login)?$|^(\/(event|project|skill|article|member))?(\/\d+)?$)/,
  whiteList: /(^\/(login)?$|^(\/admin)?(\/(event|project|skill|article|member))?(\/.+)?$)/
}
export const iconTypes: { [key in SnackbarTypeList]: SnackbarType } = {
  info: {
    icon: 'mdi-information-outline',
    color: 'text-white',
    background: 'bg-grey-lighten-1'
  },
  warning: {
    icon: 'mdi-alert-outline',
    color: 'text-white',
    background: 'bg-orange-darken-1'
  },
  alert: {
    icon: 'mdi-alert-octagon-outline',
    color: 'text-white',
    background: 'bg-red-darken-3'
  },
  success: {
    icon: 'mdi-check-circle-outline',
    color: 'text-white',
    background: 'bg-light-green'
  }
}
export const Greetings = (name = 'スーパーエンジニア'): string[] => [
  'Hi, ' + name + '!',
  'Welcome back, ' + name + '!',
  'おかえりなさい！' + name + 'さん',
  name + 'は今日何するの？',
  'さーて、' + name + 'といっちょやりますか！',
  'おっとぉ？！新進気鋭の' + name + 'が登場だー！',
  'おっとぉ？！先進気鋭の...え？新進気鋭？。。。あ。',
  name + 'は最近どう？',
  name + '、疲れてない？  少し離れてみるのも大事でっせ',
  name.includes('スーパーエンジニア') || name.includes('ゲスト')
    ? 'ガハハハ  早く名前を変えないとスーパーエンジニアになる呪いをかけたぞ'
    : 'スーパーエンジニアの...って分かってますよ、' + name + 'さん'
]
export const InputComponents = (key?: string, v?: any): InputComponentsType => {
  return {
    textfield: {
      comp: 'v-text-field',
      props: {
        density: 'compact',
        clearable: true,
        class: 'text-main-color',
        disabled: key === 'id' || key === 'email'
      }
    },
    textarea: {
      comp: 'v-textarea',
      props: { density: 'compact', clearable: true, class: 'text-main-color' }
    },
    richtext: { comp: 'module-tiptap' },
    switch: {
      comp: 'v-switch',
      props: {
        density: 'compact',
        'hide-details': true,
        class: v ? 'text-main-color' : 'text-grey-darken-4',
        style: 'width: fit-content;'
      }
    },
    fileinput: { comp: 'atom-input-file' },
    select: { comp: 'atom-input-select' },
    radiogroup: { comp: 'atom-input-radio-group' }
  }
}
export const articleInputs: InputType[] = [
  {
    key: 'title',
    title: 'タイトル',
    type: 'textfield',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.required, v.maxString(40)]
  },
  {
    key: 'body',
    title: '本文',
    type: 'richtext',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.required, v.maxString(1000)]
  },
  {
    key: 'published',
    title: '公開状態',
    type: 'radiogroup',
    schemaType: 'Boolean',
    isArray: false,
    default: false,
    rules: [],
    props: {
      items: [
        { label: '公開中', value: true },
        { label: '非公開', value: false }
      ]
    }
  },
  {
    key: 'userArticleId',
    title: '著者',
    type: 'select',
    schemaType: 'ID',
    isArray: false,
    default: null,
    rules: [v.required, v.checkUUID],
    props: { queryName: 'listUsers', itemTitle: 'name' }
  },
  {
    key: 'projectArticleId',
    title: '関連するプロジェクト',
    type: 'select',
    schemaType: 'ID',
    isArray: false,
    default: null,
    rules: [v.checkUUID],
    props: { queryName: 'listProjects', itemTitle: 'title' }
  },
  {
    key: 'eventArticleId',
    title: '関連するイベント',
    type: 'select',
    schemaType: 'ID',
    isArray: false,
    default: null,
    rules: [v.checkUUID],
    props: { queryName: 'listEvents', itemTitle: 'title' }
  },
  {
    key: 'file',
    title: 'サムネイル画像',
    type: 'fileinput',
    schemaType: 'S3Object',
    isArray: false,
    default: null,
    rules: [v.maxFileSize(5)]
  }
]
export const eventInputs: InputType[] = [
  {
    key: 'title',
    title: 'タイトル',
    type: 'textfield',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.required, v.maxString(40)]
  },
  {
    key: 'date',
    title: '日付',
    type: 'textfield',
    schemaType: 'AWSDate',
    isArray: true,
    default: ['2000-01-01'],
    rules: [v.required, v.checkAWSDate]
  },
  {
    key: 'description',
    title: '概要',
    type: 'textarea',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.required, v.maxString(300)]
  },
  {
    key: 'wanted',
    title: '募集状態',
    type: 'radiogroup',
    schemaType: 'Boolean',
    isArray: false,
    default: false,
    rules: [],
    props: {
      items: [
        { label: '募集中', value: true },
        { label: '募集停止', value: false }
      ]
    }
  },
  {
    key: 'published',
    title: '公開状態',
    type: 'radiogroup',
    schemaType: 'Boolean',
    isArray: false,
    default: false,
    rules: [],
    props: {
      items: [
        { label: '公開中', value: true },
        { label: '非公開', value: false }
      ]
    }
  },
  {
    key: 'file',
    title: 'サムネイル画像',
    type: 'fileinput',
    schemaType: 'S3Object',
    isArray: false,
    default: null,
    rules: [v.maxFileSize(5)]
  }
]
export const userInputs: InputType[] = [
  {
    key: 'name',
    title: 'お名前',
    type: 'textfield',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.required, v.maxString(20)]
  },
  {
    key: 'email',
    title: 'メールアドレス',
    type: 'textfield',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.required]
  },
  {
    key: 'university',
    title: '大学名',
    type: 'textfield',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.required, v.maxString(40)]
  },
  {
    key: 'faculty',
    title: '学部・学科・プログラム名',
    type: 'textfield',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.required, v.maxString(40)]
  },
  {
    key: 'grade',
    title: '学年(1~6で記入して下さい)',
    type: 'textfield',
    schemaType: 'Int',
    isArray: false,
    default: 0,
    rules: [v.required, v.rangeInt([1, 6])]
  },
  {
    key: 'jobHunting',
    title: '就活状態',
    type: 'radiogroup',
    schemaType: 'Boolean',
    isArray: false,
    default: false,
    rules: [],
    props: {
      items: [
        { label: '就活中', value: true },
        { label: '就活外', value: false }
      ]
    }
  },
  {
    key: 'join',
    title: '加入日',
    type: 'textfield',
    schemaType: 'AWSDate',
    isArray: false,
    default: '',
    rules: [v.checkAWSDate]
  },
  {
    key: 'leave',
    title: '卒業日',
    type: 'textfield',
    schemaType: 'AWSDate',
    isArray: false,
    default: '',
    rules: [v.checkAWSDate]
  },
  {
    key: 'discordId',
    title: 'DiscordのID（18桁の数字）',
    type: 'textfield',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.equalString(18)]
  },
  {
    key: 'description',
    title: '簡単な自己紹介',
    type: 'textfield',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.required, v.maxString(300)]
  },
  {
    key: 'forRecruitment',
    title: '就活用長めの自己紹介',
    type: 'textarea',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.maxString(1000)]
  },
  {
    key: 'history',
    title: 'これまでの経歴',
    type: 'textarea',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.maxString(1000)]
  },
  {
    key: 'github',
    title: 'GithubのURL',
    type: 'textfield',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.checkURL, v.maxString(40)]
  },
  {
    key: 'zenn',
    title: 'ZennのURL',
    type: 'textfield',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.checkURL, v.maxString(40)]
  },
  {
    key: 'qiita',
    title: 'QiitaのURL',
    type: 'textfield',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.checkURL, v.maxString(40)]
  },
  {
    key: 'twitter',
    title: 'TwitterのURL',
    type: 'textfield',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.checkURL, v.maxString(40)]
  },
  {
    key: 'slide',
    title: 'SlideshareのURL',
    type: 'textfield',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.checkURL, v.maxString(40)]
  },
  {
    key: 'file',
    title: 'アイコン画像',
    type: 'fileinput',
    schemaType: 'S3Object',
    isArray: false,
    default: null,
    rules: [v.maxFileSize(5)]
  }
]
export const portfolioInputs: InputType[] = [
  {
    key: 'title',
    title: 'タイトル',
    type: 'textfield',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.required, v.maxString(40)]
  },
  {
    key: 'url',
    title: 'URL',
    type: 'textfield',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.checkURL, v.maxString(40)]
  },
  {
    key: 'description',
    title: '概要',
    type: 'textarea',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.required, v.maxString(300)]
  },
  {
    key: 'published',
    title: '公開状態',
    type: 'radiogroup',
    schemaType: 'Boolean',
    isArray: false,
    default: false,
    rules: [],
    props: {
      items: [
        { label: '公開中', value: true },
        { label: '非公開', value: false }
      ]
    }
  },
  {
    key: 'file',
    title: 'サムネイル画像',
    type: 'fileinput',
    schemaType: 'S3Object',
    isArray: false,
    default: null,
    rules: [v.maxFileSize(5)]
  },
  {
    key: 'userPortfolioId',
    title: '作者',
    type: 'select',
    schemaType: 'ID',
    isArray: false,
    default: null,
    rules: [v.required, v.checkUUID],
    props: { queryName: 'listUsers', itemTitle: 'name' }
  }
]
export const projectInputs: InputType[] = [
  {
    key: 'title',
    title: 'タイトル',
    type: 'textfield',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.required, v.maxString(40)]
  },
  {
    key: 'start',
    title: '開始日',
    type: 'textfield',
    schemaType: 'AWSDate',
    isArray: false,
    default: '',
    rules: [v.checkAWSDate]
  },
  {
    key: 'end',
    title: '終了日',
    type: 'textfield',
    schemaType: 'AWSDate',
    isArray: false,
    default: '',
    rules: [v.checkAWSDate]
  },
  {
    key: 'description',
    title: '概要',
    type: 'textarea',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.required, v.maxString(300)]
  },
  {
    key: 'wanted',
    title: '募集状態',
    type: 'radiogroup',
    schemaType: 'Boolean',
    isArray: false,
    default: false,
    rules: [],
    props: {
      items: [
        { label: '募集中', value: true },
        { label: '募集停止', value: false }
      ]
    }
  },
  {
    key: 'published',
    title: '公開状態',
    type: 'radiogroup',
    schemaType: 'Boolean',
    isArray: false,
    default: false,
    rules: [],
    props: {
      items: [
        { label: '公開中', value: true },
        { label: '非公開', value: false }
      ]
    }
  },
  {
    key: 'file',
    title: 'サムネイル画像',
    type: 'fileinput',
    schemaType: 'S3Object',
    isArray: false,
    default: null,
    rules: [v.maxFileSize(5)]
  }
]
export const skillInputs: InputType[] = [
  {
    key: 'title',
    title: 'スキルタグ名',
    type: 'textfield',
    schemaType: 'String',
    isArray: false,
    default: '',
    rules: [v.required, v.maxString(40)]
  }
]
export const articleSkillInputs: InputType[] = [
  {
    key: 'articleID',
    title: '紐づける記事',
    type: 'select',
    schemaType: 'ID',
    isArray: false,
    default: '',
    rules: [v.required],
    props: { queryName: 'listArticles', itemTitle: 'title' }
  },
  {
    key: 'skillID',
    title: '紐づけるスキルタグ',
    type: 'select',
    schemaType: 'ID',
    isArray: false,
    default: '',
    rules: [v.required],
    props: { queryName: 'listSkills', itemTitle: 'title' }
  }
]
export const eventUserInputs: InputType[] = [
  {
    key: 'eventID',
    title: '紐づけるイベント',
    type: 'select',
    schemaType: 'ID',
    isArray: false,
    default: '',
    rules: [v.required],
    props: { queryName: 'listEvents', itemTitle: 'title' }
  },
  {
    key: 'userID',
    title: '紐づけるユーザー',
    type: 'select',
    schemaType: 'ID',
    isArray: false,
    default: '',
    rules: [v.required],
    props: { queryName: 'listUsers', itemTitle: 'name' }
  }
]
export const projectUserInputs: InputType[] = [
  {
    key: 'projectID',
    title: '紐づけるプロジェクト',
    type: 'select',
    schemaType: 'ID',
    isArray: false,
    default: '',
    rules: [v.required],
    props: { queryName: 'listProjects', itemTitle: 'title' }
  },
  {
    key: 'userID',
    title: '紐づけるユーザー',
    type: 'select',
    schemaType: 'ID',
    isArray: false,
    default: '',
    rules: [v.required],
    props: { queryName: 'listUsers', itemTitle: 'name' }
  }
]
export const userSkillInputs: InputType[] = [
  {
    key: 'skillID',
    title: '紐づけるスキルタグ',
    type: 'select',
    schemaType: 'ID',
    isArray: false,
    default: '',
    rules: [v.required],
    props: { queryName: 'listSkills', itemTitle: 'title' }
  },
  {
    key: 'userID',
    title: '紐づけるユーザー',
    type: 'select',
    schemaType: 'ID',
    isArray: false,
    default: '',
    rules: [v.required],
    props: { queryName: 'listUsers', itemTitle: 'name' }
  }
]
