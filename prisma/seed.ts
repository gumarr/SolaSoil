import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Đang nạp dữ liệu mẫu...')

  // Xóa dữ liệu cũ
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.comboItem.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.combo.deleteMany({})

  // 1. Tạo Danh mục (Categories)
  const catKho = await prisma.category.create({
    data: {
      name: 'Đặc sản khô',
      icon: '🥩',
      description: 'Thịt trâu gác bếp, lạp xưởng hun khói truyền thống.'
    }
  })

  const catTra = await prisma.category.create({
    data: {
      name: 'Trà & Đồ uống',
      icon: '🍵',
      description: 'Trà Shan Tuyết cổ thụ, trà Oolong Mộc Châu.'
    }
  })

  const catQua = await prisma.category.create({
    data: {
      name: 'Trái cây tươi',
      icon: '🍎',
      description: 'Mận hậu, dâu tây, xoài tròn Yên Châu.'
    }
  })

  const catGiaVi = await prisma.category.create({
    data: {
      name: 'Gia vị & Mật ong',
      icon: '🍯',
      description: 'Mắc khén, hạt dổi, mật ong rừng nguyên chất.'
    }
  })

  // 2. Tạo Sản phẩm (Products)
  await prisma.product.createMany({
    data: [
      {
        category_id: catKho.id,
        name: 'Thịt Trâu Gác Bếp Mộc Châu',
        description: 'Thịt trâu tươi ngon tẩm ướp mắc khén hạt dổi, hun khói củi nhãn đặc trưng.',
        price: 850000,
        weight: '500g',
        stock_quantity: 50,
        ocop_stars: 5,
        origin: 'Mộc Châu, Sơn La',
        images: ['https://images.unsplash.com/photo-1544022613-e87ca75a784a'],
      },
      {
        category_id: catTra.id,
        name: 'Trà Shan Tuyết Tà Xùa',
        description: 'Búp trà hái từ cây chè cổ thụ hàng trăm năm tuổi trên đỉnh núi Tà Xùa mù sương.',
        price: 1200000,
        weight: '200g',
        stock_quantity: 30,
        ocop_stars: 5,
        origin: 'Bắc Yên, Sơn La',
        images: ['https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9'],
      },
      {
        category_id: catQua.id,
        name: 'Mận Hậu Nà Ka',
        description: 'Quả mận to tròn, giòn tan, ngọt lịm từ thung lũng mận lớn nhất Mộc Châu.',
        price: 65000,
        weight: '1kg',
        stock_quantity: 200,
        ocop_stars: 4,
        origin: 'Nà Ka, Mộc Châu',
        images: ['https://images.unsplash.com/photo-1596541221766-3543296530ee'],
      },
      {
        category_id: catGiaVi.id,
        name: 'Mật Ong Nhãn Sông Mã',
        description: 'Mật ong nguyên chất thơm mùi hoa nhãn đặc trưng của vùng đất Sông Mã.',
        price: 250000,
        weight: '500ml',
        stock_quantity: 80,
        ocop_stars: 4,
        origin: 'Sông Mã, Sơn La',
        images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38'],
      }
    ]
  })

  console.log('✅ Đã nạp dữ liệu mẫu thành công!')
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })