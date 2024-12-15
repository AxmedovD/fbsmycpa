import { computed } from 'vue'

export function usePagination(props, emit) {
  const displayedPages = computed(() => {
    const pages = []
    const maxDisplayed = 5
    let start = Math.max(1, props.currentPage - Math.floor(maxDisplayed / 2))
    let end = Math.min(props.totalPages, start + maxDisplayed - 1)

    if (end - start + 1 < maxDisplayed) {
      start = Math.max(1, end - maxDisplayed + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  })

  const updatePage = (page) => {
    emit('update:page', page)
  }

  return {
    displayedPages,
    updatePage
  }
}