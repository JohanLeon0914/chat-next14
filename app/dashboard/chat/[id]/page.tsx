"use client"
import ChatComponent from '@/public/components/ChatComponent'

export default function Page({ params }: { params: { id: string } }) {

  const { id } = params

  return (
    <div>
      <ChatComponent chatId={id} />
    </div>
  )
}
