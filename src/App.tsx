import { startTransition, useEffect, useState } from 'react'
import { ConfirmDialog } from './components/common/ConfirmDialog'
import { controlClassName, FieldShell } from './components/common/FieldShell'
import { Modal } from './components/common/Modal'
import { SectionCard } from './components/common/SectionCard'
import { StatusBadge } from './components/common/StatusBadge'
import { Toast } from './components/common/Toast'
import { ADMIN_PASSWORD, ADMIN_SESSION_STORAGE_KEY } from './constants/admin'
import { DashboardView } from './features/dashboard/DashboardView'
import { LostItemDetail } from './features/lost-items/LostItemDetail'
import { LostItemFormView } from './features/lost-items/LostItemFormView'
import { LostItemsSearchView } from './features/lost-items/LostItemsSearchView'
import { UniformDetail } from './features/uniforms/UniformDetail'
import { UniformFormView } from './features/uniforms/UniformFormView'
import { UniformSearchView } from './features/uniforms/UniformSearchView'
import { lostItemsService } from './services/lostItemsService'
import { uniformItemsService } from './services/uniformItemsService'
import type {
  AppView,
  CreateLostItemInput,
  CreateUniformItemInput,
  LostItem,
  UniformItem,
} from './types/models'

type DetailState =
  | { kind: 'lost'; item: LostItem }
  | { kind: 'uniform'; item: UniformItem }
  | null

type DeleteState =
  | { kind: 'lost'; item: LostItem }
  | { kind: 'uniform'; item: UniformItem }
  | null

type SearchNavigationItem = {
  view: 'lost-search' | 'uniform-search'
  label: string
  shortLabel: string
  countLabel: string
  title: string
  description: string
  tone: 'info' | 'success'
}

function getSearchNavigationItem(
  view: AppView,
  lostItemCount: number,
  uniformItemCount: number,
): SearchNavigationItem | null {
  if (view === 'lost-search' || view === 'lost-register') {
    return {
      view: 'lost-search',
      label: '분실물 검색',
      shortLabel: '분실물 검색',
      countLabel: `분실물 ${lostItemCount}건`,
      title: view === 'lost-register' ? '분실물 등록 화면' : '분실물 검색 화면',
      description: '사진과 발견 장소를 기준으로 분실물을 확인할 수 있습니다.',
      tone: 'info',
    }
  }

  if (view === 'uniform-search' || view === 'uniform-register') {
    return {
      view: 'uniform-search',
      label: '교복 검색',
      shortLabel: '교복 검색',
      countLabel: `교복 ${uniformItemCount}건`,
      title: view === 'uniform-register' ? '교복 등록 화면' : '교복 검색 화면',
      description: '종류와 사이즈를 기준으로 필요한 교복을 확인할 수 있습니다.',
      tone: 'success',
    }
  }

  return null
}

const viewDescription: Record<AppView, string> = {
  home: '홈',
  'lost-register': '분실물 등록',
  'lost-search': '분실물 검색',
  'uniform-register': '교복 등록',
  'uniform-search': '교복 검색',
}

function getStoredAdminAuth() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(ADMIN_SESSION_STORAGE_KEY) === 'true'
}

function isRegisterView(view: AppView) {
  return view === 'lost-register' || view === 'uniform-register'
}

function LoadingCard() {
  return (
    <div className="surface-card p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-40 rounded-full bg-paper-200" />
        <div className="h-20 rounded-[28px] bg-paper-100" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-48 rounded-[28px] bg-paper-100" />
          <div className="h-48 rounded-[28px] bg-paper-100" />
          <div className="h-48 rounded-[28px] bg-paper-100" />
        </div>
      </div>
    </div>
  )
}

function App() {
  const [activeView, setActiveView] = useState<AppView>('home')
  const [lostItems, setLostItems] = useState<LostItem[]>([])
  const [uniformItems, setUniformItems] = useState<UniformItem[]>([])
  const [isAdminAuthenticated, setIsAdminAuthenticated] =
    useState(getStoredAdminAuth)
  const [isLoading, setIsLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [detailState, setDetailState] = useState<DetailState>(null)
  const [deleteState, setDeleteState] = useState<DeleteState>(null)
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false)
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)
  const [adminPasswordInput, setAdminPasswordInput] = useState('')
  const [adminPasswordError, setAdminPasswordError] = useState<string | null>(
    null,
  )
  const [pendingAdminView, setPendingAdminView] = useState<AppView | null>(null)

  const isHomeView = activeView === 'home'
  const searchNavigationItem = getSearchNavigationItem(
    activeView,
    lostItems.length,
    uniformItems.length,
  )

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true)

      try {
        const [nextLostItems, nextUniformItems] = await Promise.all([
          lostItemsService.getLostItems(),
          uniformItemsService.getUniformItems(),
        ])
        setLostItems(nextLostItems)
        setUniformItems(nextUniformItems)
      } catch {
        setToastMessage('데이터를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadInitialData()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        ADMIN_SESSION_STORAGE_KEY,
        String(isAdminAuthenticated),
      )
    }
  }, [isAdminAuthenticated])

  useEffect(() => {
    if (!toastMessage) {
      return undefined
    }

    const timer = window.setTimeout(() => setToastMessage(null), 2600)
    return () => window.clearTimeout(timer)
  }, [toastMessage])

  function openAdminLogin(targetView: AppView | null = null) {
    setPendingAdminView(targetView)
    setAdminPasswordInput('')
    setAdminPasswordError(null)
    setIsAdminLoginOpen(true)
  }

  function closeAdminLogin() {
    setIsAdminLoginOpen(false)
    setAdminPasswordInput('')
    setAdminPasswordError(null)
    setPendingAdminView(null)
  }

  function navigate(view: AppView) {
    if (isRegisterView(view) && !isAdminAuthenticated) {
      openAdminLogin(view)
      return
    }

    startTransition(() => setActiveView(view))
  }

  function navigateFromAdminPanel(view: AppView) {
    setIsAdminPanelOpen(false)
    navigate(view)
  }

  async function refreshLostItems() {
    const nextLostItems = await lostItemsService.getLostItems()
    setLostItems(nextLostItems)
  }

  async function refreshUniformItems() {
    const nextUniformItems = await uniformItemsService.getUniformItems()
    setUniformItems(nextUniformItems)
  }

  async function handleLostItemCreate(input: CreateLostItemInput) {
    await lostItemsService.createLostItem(input)
    await refreshLostItems()
    setToastMessage('분실물 항목이 등록되었습니다.')
  }

  async function handleUniformItemCreate(input: CreateUniformItemInput) {
    await uniformItemsService.createUniformItem(input)
    await refreshUniformItems()
    setToastMessage('교복 항목이 등록되었습니다.')
  }

  async function handleDeleteConfirm() {
    if (!deleteState || !isAdminAuthenticated) {
      return
    }

    if (deleteState.kind === 'lost') {
      await lostItemsService.deleteLostItem(deleteState.item.id)
      await refreshLostItems()
      setToastMessage('분실물 항목을 삭제했습니다.')
    } else {
      await uniformItemsService.deleteUniformItem(deleteState.item.id)
      await refreshUniformItems()
      setToastMessage('교복 항목을 삭제했습니다.')
    }

    setDetailState(null)
    setDeleteState(null)
  }

  function handleAdminLogout() {
    setIsAdminAuthenticated(false)
    setIsAdminPanelOpen(false)
    setDeleteState(null)

    if (isRegisterView(activeView)) {
      setActiveView('home')
    }

    setToastMessage('관리자 로그아웃되었습니다.')
  }

  function handleAdminLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (adminPasswordInput.trim() !== ADMIN_PASSWORD) {
      setAdminPasswordError('비밀번호가 올바르지 않습니다.')
      return
    }

    setIsAdminAuthenticated(true)
    setIsAdminLoginOpen(false)
    setAdminPasswordInput('')
    setAdminPasswordError(null)
    setToastMessage('관리자 로그인이 완료되었습니다.')

    if (pendingAdminView) {
      startTransition(() => setActiveView(pendingAdminView))
      setPendingAdminView(null)
      return
    }

    setIsAdminPanelOpen(true)
  }

  function renderAdminRequiredView(title: string) {
    return (
      <SectionCard
        title={title}
        description="이 화면은 관리자만 사용할 수 있습니다."
      >
        <div className="soft-card space-y-4 p-5">
          <p className="text-sm text-ink-700/80">
            계속하려면 관리자 비밀번호를 입력해 주세요.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openAdminLogin(activeView)}
              className="rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-700"
            >
              관리자 로그인
            </button>
            <button
              type="button"
              onClick={() => navigate('home')}
              className="rounded-full border border-ink-900/12 bg-white px-5 py-3 text-sm font-semibold text-ink-700 transition hover:bg-paper-100"
            >
              홈으로 이동
            </button>
          </div>
        </div>
      </SectionCard>
    )
  }

  function renderCurrentView() {
    switch (activeView) {
      case 'home':
        return <DashboardView onNavigate={navigate} />
      case 'lost-register':
        if (!isAdminAuthenticated) {
          return renderAdminRequiredView('분실물 등록')
        }

        return (
          <LostItemFormView
            onSubmit={handleLostItemCreate}
            onNavigateToSearch={() => navigate('lost-search')}
          />
        )
      case 'lost-search':
        return (
          <LostItemsSearchView
            items={lostItems}
            isAdmin={isAdminAuthenticated}
            onOpenDetail={(item) => setDetailState({ kind: 'lost', item })}
            onRequestDelete={(item) => setDeleteState({ kind: 'lost', item })}
          />
        )
      case 'uniform-register':
        if (!isAdminAuthenticated) {
          return renderAdminRequiredView('교복 등록')
        }

        return (
          <UniformFormView
            onSubmit={handleUniformItemCreate}
            onNavigateToSearch={() => navigate('uniform-search')}
          />
        )
      case 'uniform-search':
        return (
          <UniformSearchView
            items={uniformItems}
            isAdmin={isAdminAuthenticated}
            onOpenDetail={(item) => setDetailState({ kind: 'uniform', item })}
            onRequestDelete={(item) =>
              setDeleteState({ kind: 'uniform', item })
            }
          />
        )
      default:
        return null
    }
  }

  return (
    <div
      className={
        isHomeView
          ? 'min-h-screen px-2 py-2 sm:px-4 md:p-4'
          : 'min-h-screen pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:pb-10'
      }
    >
      <div
        className={
          isHomeView
            ? 'mx-auto flex min-h-[calc(100vh-1rem)] max-w-[1500px] items-center'
            : 'mx-auto max-w-[1500px] px-2 py-2 sm:px-4 md:py-4 lg:px-6'
        }
      >
        {!isHomeView ? (
          <header className="surface-card sticky top-2 z-30 overflow-hidden p-3 md:top-3 md:p-5">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-mint-500 to-gold-600" />
            <div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div className="space-y-2 md:space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('home')}
                    className="rounded-full border border-ink-900/10 bg-white px-3 py-1 text-xs font-semibold text-ink-700 transition hover:bg-paper-100"
                  >
                    처음 화면
                  </button>
                  <div className="hidden flex-wrap gap-2 sm:flex">
                    <StatusBadge tone="neutral">
                      {viewDescription[activeView]}
                    </StatusBadge>
                    {searchNavigationItem ? (
                      <StatusBadge tone={searchNavigationItem.tone}>
                        {searchNavigationItem.countLabel}
                      </StatusBadge>
                    ) : null}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-ink-700/55 md:text-xs md:tracking-[0.2em]">
                    학교 분실물 · 교복 물려주기 관리 시스템
                  </p>
                  <h1 className="mt-1 text-[1.35rem] font-semibold leading-tight text-ink-950 sm:text-[1.55rem] md:mt-2 md:text-[2.3rem]">
                    {searchNavigationItem?.title ?? '학교용 검색 화면'}
                  </h1>
                  <p className="mt-2 hidden max-w-3xl text-sm text-ink-700/82 sm:block md:mt-3 md:text-base">
                    {searchNavigationItem?.description ??
                      '필요한 물품을 빠르게 확인할 수 있습니다.'}
                  </p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 md:gap-3">
                <div className="soft-card hidden p-4 sm:block">
                  <p className="text-sm text-ink-700/75">현재 화면</p>
                  <p className="mt-2 text-lg font-semibold text-ink-950">
                    {searchNavigationItem?.countLabel ?? '검색 화면'}
                  </p>
                  <p className="mt-2 text-sm text-ink-700/78">
                    검색과 상세 확인은 누구나 사용할 수 있습니다.
                  </p>
                </div>

                <div className="soft-card p-3 md:p-4">
                  <div className="flex items-center justify-between gap-3 md:gap-4">
                    <div>
                      <p className="text-xs text-ink-700/75 md:text-sm">관리자</p>
                      <p className="mt-1 text-base font-semibold text-ink-950 md:mt-2 md:text-lg">
                        {isAdminAuthenticated ? '로그인됨' : '로그인 필요'}
                      </p>
                    </div>
                    {isAdminAuthenticated ? (
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAdminPanelOpen(true)}
                          className="rounded-full bg-ink-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-ink-700 md:px-4 md:text-sm"
                        >
                          관리자 메뉴
                        </button>
                        <button
                          type="button"
                          onClick={handleAdminLogout}
                          className="rounded-full bg-coral-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-coral-500 md:px-4 md:text-sm"
                        >
                          로그아웃
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openAdminLogin()}
                        className="rounded-full bg-ink-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-ink-700 md:px-4 md:text-sm"
                      >
                        관리자 로그인
                      </button>
                    )}
                  </div>
                  <p className="mt-2 hidden text-sm text-ink-700/78 sm:block md:mt-3">
                    등록과 삭제는 관리자 로그인 후 사용할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            {searchNavigationItem ? (
              <nav className="mt-5 hidden md:block">
                <button
                  type="button"
                  onClick={() => navigate(searchNavigationItem.view)}
                  className={`w-full rounded-[20px] px-4 py-3 text-sm font-semibold transition ${
                    activeView === searchNavigationItem.view
                      ? 'bg-ink-900 text-white shadow-[var(--shadow-soft)]'
                      : 'bg-paper-100 text-ink-700 hover:bg-white'
                  }`}
                >
                  {searchNavigationItem.label}
                </button>
              </nav>
            ) : null}
          </header>
        ) : null}

        <main className={isHomeView ? 'w-full' : 'mt-3 md:mt-6'}>
          {isLoading ? <LoadingCard /> : renderCurrentView()}
        </main>
      </div>

      {!isHomeView && searchNavigationItem ? (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/70 bg-paper-50/95 px-3 pb-[calc(0.65rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
          <div className="mx-auto grid max-w-[720px] grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => navigate(searchNavigationItem.view)}
              className={`min-h-12 rounded-2xl px-2 py-2 text-xs font-semibold transition ${
                activeView === searchNavigationItem.view
                  ? 'bg-ink-900 text-white'
                  : 'bg-paper-100 text-ink-700 hover:bg-white'
              }`}
            >
              {searchNavigationItem.shortLabel}
            </button>
          </div>
        </nav>
      ) : null}

      <Modal
        open={detailState !== null}
        title={detailState?.kind === 'lost' ? '분실물 상세' : '교복 상세'}
        description={
          detailState?.kind === 'lost'
            ? '보관 위치와 폐기 기준 날짜를 확인할 수 있습니다.'
            : '사이즈와 상태, 수량을 확인할 수 있습니다.'
        }
        onClose={() => setDetailState(null)}
      >
        {detailState?.kind === 'lost' ? (
          <LostItemDetail
            item={detailState.item}
            isAdmin={isAdminAuthenticated}
            onRequestDelete={() =>
              setDeleteState({ kind: 'lost', item: detailState.item })
            }
          />
        ) : null}

        {detailState?.kind === 'uniform' ? (
          <UniformDetail
            item={detailState.item}
            isAdmin={isAdminAuthenticated}
            onRequestDelete={() =>
              setDeleteState({ kind: 'uniform', item: detailState.item })
            }
          />
        ) : null}
      </Modal>

      <Modal
        open={isAdminLoginOpen}
        title="관리자 로그인"
        description={
          pendingAdminView
            ? `${viewDescription[pendingAdminView]} 화면으로 이동하려면 비밀번호를 입력해 주세요.`
            : '관리자 메뉴를 사용하려면 비밀번호를 입력해 주세요.'
        }
        maxWidthClassName="max-w-lg"
        onClose={closeAdminLogin}
      >
        <form className="space-y-4" onSubmit={handleAdminLoginSubmit}>
          <FieldShell label="비밀번호" htmlFor="admin-password" required>
            <input
              id="admin-password"
              type="password"
              className={controlClassName}
              placeholder="관리자 비밀번호 입력"
              value={adminPasswordInput}
              onChange={(event) => {
                setAdminPasswordInput(event.target.value)
                setAdminPasswordError(null)
              }}
              autoFocus
            />
          </FieldShell>

          {adminPasswordError ? (
            <div className="rounded-[22px] border border-coral-500/20 bg-coral-100/80 px-4 py-3 text-sm text-coral-700">
              {adminPasswordError}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeAdminLogin}
              className="rounded-full border border-ink-900/12 bg-white px-5 py-3 text-sm font-semibold text-ink-700 transition hover:bg-paper-100"
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-700"
            >
              로그인
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={isAdminPanelOpen && isAdminAuthenticated}
        title="관리자 메뉴"
        description="등록 화면은 이 메뉴에서만 이동할 수 있습니다."
        maxWidthClassName="max-w-2xl"
        onClose={() => setIsAdminPanelOpen(false)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigateFromAdminPanel('lost-register')}
            className="soft-card p-5 text-left transition hover:-translate-y-1 hover:bg-white"
          >
            <p className="text-lg font-semibold text-ink-950">분실물 등록</p>
            <p className="mt-2 text-sm text-ink-700/80">
              새로 발견한 분실물을 등록합니다.
            </p>
          </button>
          <button
            type="button"
            onClick={() => navigateFromAdminPanel('uniform-register')}
            className="soft-card p-5 text-left transition hover:-translate-y-1 hover:bg-white"
          >
            <p className="text-lg font-semibold text-ink-950">교복 등록</p>
            <p className="mt-2 text-sm text-ink-700/80">
              교복창고에 보관할 교복을 등록합니다.
            </p>
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteState !== null}
        title={deleteState?.kind === 'lost' ? '분실물 삭제' : '교복 삭제'}
        description={
          deleteState?.kind === 'lost'
            ? `${deleteState.item.itemName} 항목을 삭제할까요?`
            : `${deleteState?.item.uniformType} ${deleteState?.item.size} 항목을 삭제할까요?`
        }
        confirmLabel="삭제하기"
        onCancel={() => setDeleteState(null)}
        onConfirm={() => void handleDeleteConfirm()}
      />

      {toastMessage ? <Toast message={toastMessage} /> : null}
    </div>
  )
}

export default App
