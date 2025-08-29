'use client'

import { useTranslation } from '@/hooks/useTranslation'
import FixedLink from './FixedLink'
import { Globe, Mail, Heart, Shield, FileText, Users, Github, Twitter } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: t('footer.cities'), href: '/cities' },
      { name: t('footer.visaGuide'), href: '/visa-guide' },
      { name: t('footer.community'), href: '/community' },
      { name: t('footer.tools'), href: '/tools' }
    ],
    company: [
      { name: t('footer.about'), href: '/about' },
      { name: t('footer.contact'), href: '/contact' },
      { name: t('footer.blog'), href: '/blog' },
      { name: t('footer.careers'), href: '/careers' }
    ],
    legal: [
      { name: t('footer.privacy'), href: '/privacy' },
      { name: t('footer.terms'), href: '/terms' },
      { name: t('footer.cookies'), href: '/cookies' },
      { name: t('footer.security'), href: '/security' }
    ],
    support: [
      { name: t('footer.help'), href: '/help' },
      { name: t('footer.faq'), href: '/faq' },
      { name: t('footer.status'), href: '/status' },
      { name: t('footer.feedback'), href: '/feedback' }
    ]
  }

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/nomad-now',
      icon: Github,
      color: 'hover:text-gray-900'
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/nomad_now',
      icon: Twitter,
      color: 'hover:text-blue-500'
    }
  ]

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Nomad Now</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              {t('footer.description')}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 transition-colors ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              {t('footer.product')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <FixedLink
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    {link.name}
                  </FixedLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              {t('footer.company')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <FixedLink
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    {link.name}
                  </FixedLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              {t('footer.legal')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <FixedLink
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    {link.name}
                  </FixedLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              {t('footer.support')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <FixedLink
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    {link.name}
                  </FixedLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>&copy; {currentYear} Nomad Now. {t('footer.allRightsReserved')}</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">{t('footer.madeWith')} <Heart className="inline h-4 w-4 text-red-500" /></span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <FixedLink href="/privacy" className="hover:text-gray-900 transition-colors">
                <Shield className="inline h-4 w-4 mr-1" />
                {t('footer.privacy')}
              </FixedLink>
              <FixedLink href="/terms" className="hover:text-gray-900 transition-colors">
                <FileText className="inline h-4 w-4 mr-1" />
                {t('footer.terms')}
              </FixedLink>
              <a href="mailto:hello@nomad.now" className="hover:text-gray-900 transition-colors">
                <Mail className="inline h-4 w-4 mr-1" />
                {t('footer.contact')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
