import { logInfo, logError } from '@/lib/logger'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface FormValidationRules {
  [fieldName: string]: ValidationRule
}

// 通用表单验证函数
export function validateForm(data: any, rules: FormValidationRules): ValidationResult {
  const errors: string[] = []
  
  for (const [fieldName, rule] of Object.entries(rules)) {
    const value = data[fieldName]
    
    // 必填验证
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors.push(`${fieldName} 是必填项`)
      continue
    }
    
    // 如果值为空且不是必填，跳过其他验证
    if (!value || value.toString().trim() === '') {
      continue
    }
    
    // 长度验证
    if (rule.minLength && value.toString().length < rule.minLength) {
      errors.push(`${fieldName} 至少需要 ${rule.minLength} 个字符`)
    }
    
    if (rule.maxLength && value.toString().length > rule.maxLength) {
      errors.push(`${fieldName} 不能超过 ${rule.maxLength} 个字符`)
    }
    
    // 正则表达式验证
    if (rule.pattern && !rule.pattern.test(value.toString())) {
      errors.push(`${fieldName} 格式不正确`)
    }
    
    // 自定义验证
    if (rule.custom) {
      const customResult = rule.custom(value)
      if (customResult !== true) {
        errors.push(typeof customResult === 'string' ? customResult : `${fieldName} 验证失败`)
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Meetup表单验证规则
export const meetupFormRules: FormValidationRules = {
  location: {
    required: true,
    minLength: 3,
    maxLength: 100,
    custom: (value: string) => {
      if (value.length < 3) return '地点名称至少需要3个字符'
      if (value.length > 100) return '地点名称不能超过100个字符'
      return true
    }
  },
  time: {
    required: true,
    custom: (value: string) => {
      const selectedTime = new Date(value)
      const now = new Date()
      
      // 检查是否是未来时间
      if (selectedTime <= now) {
        return '请选择未来的时间'
      }
      
      // 检查是否在合理范围内（比如不超过30天）
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      
      if (selectedTime > thirtyDaysFromNow) {
        return '时间不能超过30天以后'
      }
      
      return true
    }
  },
  description: {
    maxLength: 500,
    custom: (value: string) => {
      if (value && value.length > 500) {
        return '描述不能超过500个字符'
      }
      return true
    }
  }
}

// 用户注册表单验证规则
export const userRegistrationRules: FormValidationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return '请输入有效的邮箱地址'
      }
      return true
    }
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\u4e00-\u9fa5\s]+$/,
    custom: (value: string) => {
      if (value.length < 2) return '姓名至少需要2个字符'
      if (value.length > 50) return '姓名不能超过50个字符'
      if (!/^[a-zA-Z\u4e00-\u9fa5\s]+$/.test(value)) {
        return '姓名只能包含字母、中文和空格'
      }
      return true
    }
  },
  interests: {
    required: true,
    custom: (value: string[]) => {
      if (!Array.isArray(value) || value.length === 0) {
        return '请至少选择一个兴趣'
      }
      if (value.length > 10) {
        return '兴趣不能超过10个'
      }
      return true
    }
  }
}

// 实时验证函数
export function validateField(value: any, rule: ValidationRule, fieldName: string): string | null {
  // 必填验证
  if (rule.required && (!value || value.toString().trim() === '')) {
    return `${fieldName} 是必填项`
  }
  
  // 如果值为空且不是必填，返回null
  if (!value || value.toString().trim() === '') {
    return null
  }
  
  // 长度验证
  if (rule.minLength && value.toString().length < rule.minLength) {
    return `${fieldName} 至少需要 ${rule.minLength} 个字符`
  }
  
  if (rule.maxLength && value.toString().length > rule.maxLength) {
    return `${fieldName} 不能超过 ${rule.maxLength} 个字符`
  }
  
  // 正则表达式验证
  if (rule.pattern && !rule.pattern.test(value.toString())) {
    return `${fieldName} 格式不正确`
  }
  
  // 自定义验证
  if (rule.custom) {
    const customResult = rule.custom(value)
    if (customResult !== true) {
      return typeof customResult === 'string' ? customResult : `${fieldName} 验证失败`
    }
  }
  
  return null
}

// 格式化错误消息
export function formatValidationErrors(errors: string[]): string {
  if (errors.length === 0) return ''
  if (errors.length === 1) return errors[0]
  return errors.join('；')
}

// 验证时间格式
export function validateTimeFormat(timeString: string): boolean {
  const time = new Date(timeString)
  return !isNaN(time.getTime())
}

// 验证日期是否在未来
export function validateFutureDate(dateString: string): boolean {
  const date = new Date(dateString)
  const now = new Date()
  return date > now
}

// 验证距离范围
export function validateDistance(distance: number, min: number = 0, max: number = 1000): boolean {
  return distance >= min && distance <= max
}

// 验证邮箱格式
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 验证手机号格式（国际格式）
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}
