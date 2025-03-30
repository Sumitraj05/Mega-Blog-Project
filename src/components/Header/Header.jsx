import React from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

  const navItems = [
    { name: 'Home', slug: "/", active: true }, 
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ]

  return (
    <header className='py-4 shadow-lg bg-gradient-to-r from-gray-700 via-gray-900 to-black'>
      <Container>
        <nav className='flex items-center'>
          {/* Logo */}
          <div className='mr-4 w-12 h-10'>
            <Link to='/'>
              <Logo width='70px' />
            </Link>
          </div>

          {/* Navigation Items */}
          <ul className='flex ml-auto space-x-6'>
            {navItems.map((item) => 
              item.active && (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className='text-white text-lg font-semibold uppercase px-6 py-2 rounded-full transition-all duration-300 ease-in-out hover:text-yellow-400 hover:scale-105 cursor-pointer'
                  >
                    {item.name}
                  </button>
                </li>
              )
            )}
            
            {/* Logout Button */}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header
