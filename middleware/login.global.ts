import { Auth } from 'aws-amplify'
import { Regexp } from '~/assets/enum'
import type { User, ListUsersQuery } from '~/assets/API'
import { listUsers } from '~/assets/graphql/queries'
import { createUser } from '~/assets/graphql/mutations'
import { useLoginState, useMyUser } from '~/composables/useState'
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isSignedIn, setSignedIn, setAdmin } = useLoginState()
  const { setCognitoUser, setMyUser } = useMyUser()
  console.debug(from.path + '=>' + to.path)
  if (to.name !== 'index' && Regexp.normalize.test(to.path)) {
    return navigateTo(to.path.substring(0, to.path.length - 1))
  }
  if (!Regexp.whiteList.test(to.path)) return navigateTo('/')
  const user = await Auth.currentUserPoolUser().catch(() => clearError())
  console.debug('currentUserPoolUser', user)
  setSignedIn(!!user)
  if (user) {
    setCognitoUser(user)
    const { data } = await listQuery<ListUsersQuery, User>({
      query: listUsers,
      queryName: 'listUsers',
      filter: { email: { eq: user.attributes.email } }
    })
    if (data.value?.length) setMyUser(data.value[0])
    else {
      const res = await baseMutation({
        query: createUser,
        input: { email: user.attributes.email }
      })
      console.debug('新規User作成', res)
    }
  }
  if (to.path.includes('login') && isSignedIn.value) return navigateTo('/admin')
  if (to.path.includes('admin')) {
    if (isSignedIn.value) {
      setAdmin(
        user?.signInUserSession.accessToken.payload['cognito:groups'] &&
          user?.signInUserSession.accessToken.payload['cognito:groups'].includes('Admin')
      )
    } else return navigateTo('/login')
  }
})
