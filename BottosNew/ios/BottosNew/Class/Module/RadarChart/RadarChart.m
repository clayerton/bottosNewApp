//
//  RadarChart.m
//  RadarMap
//
//  Created by A053 on 16/9/22.
//  Copyright © 2016年 Yvan. All rights reserved.
//


#define RADAR_WIDTH     300
#define RADAR_HEIGHT    250
#define FONT(x)         [UIFont systemFontOfSize:(x*(375.0/375.0))]
#define LENGTH(x)       (x*(375.0/375.0))
#define RGB_M(r,g,b)     [UIColor colorWithRed:(r/255.0) green:(g/255.0) blue:(b/255.0) alpha:1]

#import "RadarChart.h"


@implementation ElementItem
- (void)setValue:(id)value forUndefinedKey:(nonnull NSString *)key {}
@end

@implementation Item

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    self.colorView = [[UIView alloc]initWithFrame:CGRectMake(0, 0, LENGTH(10), LENGTH(10))];
    [self addSubview:self.colorView];
    
    self.itemLabel = [[UILabel alloc]initWithFrame:CGRectMake(LENGTH(16), 0, LENGTH(40), LENGTH(10))];
    self.itemLabel.font = FONT(10);
    self.itemLabel.textAlignment = NSTextAlignmentLeft;
    self.itemLabel.textColor = RGB_M(148, 124, 175);
    [self addSubview:self.itemLabel];
  }
  return self;
}

@end

@interface RadarChart()

@property (strong, nonatomic) NSArray       *elements;
@property (strong, nonatomic) UIColor       *lengthColor;
@property (strong, nonatomic) UILabel       *ablilityLabel;
@property (strong, nonatomic) UIView        *abilityBGView;

@end

static float radar_l  = 0;
static float center_w = 0;
static float center_h = 0;

@implementation RadarChart

#pragma mark - 画雷达图主题部分

- (void)drawBody {
  
  // 获取画布
  CGContextRef context = UIGraphicsGetCurrentContext();
  // 划线颜色
  if (self.lengthColor)
    CGContextSetStrokeColorWithColor(context, self.lengthColor.CGColor);
  else
    CGContextSetStrokeColorWithColor(context, RGB_M(171, 153, 193).CGColor);
  
  CGContextSetLineWidth(context, 1);
  // 起点坐标
  CGContextMoveToPoint(context, center_w, center_h);
  // 第一条线
  CGContextAddLineToPoint(context, center_w, center_h - radar_l);
  // 添加元素名称
  UILabel *bodyLabel = [self buildElementLabelWithText:[self.elements[0] objectForKey:@"name"] Frame:CGRectMake(center_w-LENGTH(30), center_h-radar_l-LENGTH(20), LENGTH(60), LENGTH(13)) Alignment:NSTextAlignmentCenter];
  [self addSubview:bodyLabel];
  
  //画元素主干
  for (int i = 1; i <self.elements.count; i++) {
    float x   = 0;
    float y   = 0;
    double pi = (M_PI*2.0/(self.elements.count))*i;
    // 计算主干落点坐标
    Coordinate_2(pi, radar_l, center_w, center_h,&x, &y);
    //添加元素名称
    UILabel *bodyLabel;
    CGRect frame;
    if (x > center_w) {
      frame = CGRectMake(x+LENGTH(7), y-LENGTH(7.5), LENGTH(60), LENGTH(13));
      bodyLabel = [self buildElementLabelWithText:[self.elements[i] objectForKey:@"name"] Frame:frame Alignment:NSTextAlignmentLeft];
    } else if (x == center_w) {
      if (y>center_h) {
        frame = CGRectMake(x-LENGTH(30), y+LENGTH(7), LENGTH(60), LENGTH(13));
      } else {
        frame = CGRectMake(x-LENGTH(30), y-LENGTH(20), LENGTH(60), LENGTH(13));
      }
      bodyLabel = [self buildElementLabelWithText:[self.elements[i] objectForKey:@"name"] Frame:frame Alignment:NSTextAlignmentCenter];
    } else {
      frame = CGRectMake(x-LENGTH(67), y-LENGTH(7.5), LENGTH(60), LENGTH(13));
      bodyLabel = [self buildElementLabelWithText:[self.elements[i] objectForKey:@"name"] Frame:frame Alignment:NSTextAlignmentRight];
    }
    [self addSubview:bodyLabel];
    // 设置每次的初始点坐标
    CGContextMoveToPoint(context, center_w, center_h);
    // 设置终点坐标
    CGContextAddLineToPoint(context, x, y);
  }
  CGContextStrokePath(context);
  
}

#pragma mark - 画雷达分等分图

- (void)buildPart {
  
  float r = 5.0f;
  
  // 获取画布
  CGContextRef context = UIGraphicsGetCurrentContext();
  // 划线颜色
  if (self.lengthColor)
    CGContextSetStrokeColorWithColor(context, self.lengthColor.CGColor);
  else
    CGContextSetStrokeColorWithColor(context, RGB_M(171, 153, 193).CGColor);
  
  // 划线宽度
  CGContextSetLineWidth(context, 1);
  // 添加百分比
//  UILabel *partLabel = [self buildPartLabelWithText:@"0" Frame:CGRectMake(center_w-LENGTH(25), center_h-LENGTH(3), LENGTH(20), LENGTH(6))];
//  [self addSubview:partLabel];
  // 话分割线
  for (int j = 0; j<r; j++) {
    // 设置每次的初始点坐标
    CGContextMoveToPoint(context, center_w,center_h -radar_l);
    // 添加百分比
//    UILabel *partLabels = [self buildPartLabelWithText:[NSString stringWithFormat:@"%.f",100*((r-j)/r)] Frame:CGRectMake(center_w-LENGTH(30), center_h -radar_l + radar_l*j/r-LENGTH(4), LENGTH(25), LENGTH(6))];
//    [self addSubview:partLabels];
    // 画百分比分部
    for (int i = 1; i<=self.elements.count; i++) {
      float x   = 0;
      float y   = 0;
      double pi = (M_PI*2.0/(self.elements.count))*i;
      Coordinate_2(pi,radar_l*(r-j)/r, center_w, center_h,&x, &y);
      
      if (i == 1) {
        CGContextMoveToPoint(context, center_w, center_h -radar_l + radar_l*j/r);
      }
      if (i == self.elements.count) {
        CGContextAddLineToPoint(context, center_w, center_h -radar_l + radar_l*j/r);
      } else {
        CGContextAddLineToPoint(context, x, y);
      }
    }
    
  }
  CGContextStrokePath(context);
}


#pragma mark - 画百分比占比线

- (void)buildPercent:(CGRect)rect {
  
  //    for (int i = 0; i<self.items.count; i++) {
  //        ElementItem *item = self.items[i];
  
  // 获取画布
  CGContextRef context = UIGraphicsGetCurrentContext();
  //  CGContextClearRect(context, rect);
  
  CGContextSetFillColorWithColor(context, RGB_M(171, 153, 193).CGColor);
  //  CGContextSetStrokeColorWithColor(context, [UIColor redColor].CGColor);
  // 划线宽度
  //  CGContextSetLineWidth(context, 2);
  CGContextMoveToPoint(context, center_w, center_h-radar_l +radar_l*(1-[[self.elements[0] objectForKey:@"value"] floatValue]/10000.0));
  for (int j = 1; j<=self.elements.count; j++) {
    float x   = 0;
    float y   = 0;
    
    if (j == self.elements.count) {
      //终点，最终回到开始点坐标
      CGContextAddLineToPoint(context, center_w, center_h-radar_l +radar_l*(1-[[self.elements[0] objectForKey:@"value"] floatValue]/10000.0));
    } else {
      double pi = (M_PI*2.0/(self.elements.count))*j;
      Coordinate_2(pi,radar_l*[[self.elements[j] objectForKey:@"value"] floatValue]/10000.0, center_w, center_h,&x, &y);
      CGContextAddLineToPoint(context, x, y);
    }
  }
  //  CGContextStrokePath(context);
  CGContextFillPath(context);
  //    }
  
}


#pragma mark - 算落点坐标

void Coordinate_2 (double pi, float l, float c_w , float c_h, float *x, float *y) {
  *x = c_w + sin(pi)*l;
  *y = c_h - cos(pi)*l;
}

#pragma mark - 百分比占比label

- (UILabel *)buildPartLabelWithText:(NSString *)text Frame:(CGRect)frame{
  UILabel *label = [[UILabel alloc]initWithFrame:frame];
  label.textAlignment = NSTextAlignmentRight;
  label.font = [UIFont systemFontOfSize:frame.size.height];
  label.text = text;
  return label;
}

#pragma mark - 能力测试方面label

- (UILabel *)buildElementLabelWithText:(NSString *)text Frame:(CGRect)frame Alignment:(NSTextAlignment)alignment {
  UILabel *label = [[UILabel alloc]initWithFrame:frame];
  label.textAlignment = alignment;
  label.font = [UIFont boldSystemFontOfSize:frame.size.height];
  label.text = text;
  label.textColor = RGB_M(148, 124, 175);;
  return label;
}

#pragma mark - 能力评估的几个模块

- (void)abillityOptions {
  
  // 能力苹果模块
  self.abilityBGView = [[UIView alloc] initWithFrame:CGRectMake(LENGTH(30), LENGTH(25), RADAR_WIDTH-LENGTH(60), LENGTH(10))];
  [self addSubview:self.abilityBGView];
}

- (instancetype)initWithRadarElements:(NSArray *)elements{
  if (self = [super init]) {
    
    self.frame = CGRectMake(0, 0, RADAR_WIDTH, RADAR_HEIGHT);
//    self.backgroundColor = RGB_M(243, 243, 243);
    self.lengthColor = RGB_M(148, 124, 175);;
    
    radar_l  = LENGTH(88);
    center_w = RADAR_WIDTH/2;
    center_h = RADAR_HEIGHT/2 - LENGTH(15);
    [self abillityOptions];
  }
  return self;
}

- (void)drawRect:(CGRect)rect {
  // 画百分比占比
  [self buildPercent:rect];
  // 画主体内容
  [self drawBody];
  // 画分割线
  [self buildPart];
  
}

//模拟RN使用原生组件回传数据到oc
- (void)setDataArray:(NSArray *)dataArray {
  self.elements = [NSArray arrayWithArray:dataArray];
  [self setNeedsDisplay];
}

-(void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event{
  
  self.onClickView(@{@"牛逼":@"毛哥哥"});//模拟原生回传数据给RN
  
}

/**
 只要实现了该方法并返回了特定的线程，
 那么该类下所有的方法在被RN调用时都会自觉的运行在该方法指定的线程下。
 */
- (dispatch_queue_t)methodQueue{
  return dispatch_get_main_queue();
}


@end


